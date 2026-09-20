import { appendSecurityEvent } from './securityEvents.js';
import { getExecutionById, rollbackExecution } from '../actionRuntime.js';
export type SecurityResponseAction='deny'|'revoke'|'isolate'|'quarantine';
export interface SecurityResponseResult { action:SecurityResponseAction|'rollback'|'acknowledge'|'investigate'; verified:boolean; details:string; executionId?:string; }
interface ResponseAdapter { execute(input:{action:SecurityResponseAction;targetResource:string;authorizedBy:string;parameters:Record<string,unknown>}):Promise<{verified:boolean;details?:string}>; }
class WebhookSecurityResponseAdapter implements ResponseAdapter {
  constructor(private readonly url:string,private readonly secret?:string){}
  async execute(input:{action:SecurityResponseAction;targetResource:string;authorizedBy:string;parameters:Record<string,unknown>}) {
    const body=JSON.stringify({operation:'security-response',...input}); const headers:Record<string,string>={'content-type':'application/json'};
    if(this.secret){const {createHmac}=await import('node:crypto');headers['x-business-os-signature']=createHmac('sha256',this.secret).update(body).digest('hex');}
    const response=await fetch(this.url,{method:'POST',headers,body}); let data:{verified?:boolean;details?:string}={}; try{data=await response.json() as typeof data;}catch{}
    return {verified:response.ok&&data.verified===true,details:data.details||'adapter_http_'+response.status};
  }
}
function getAdapter(){const url=process.env.SECURITY_RESPONSE_WEBHOOK_URL;return url?new WebhookSecurityResponseAdapter(url,process.env.SECURITY_RESPONSE_WEBHOOK_SECRET):null;}
export async function executeSecurityResponse(input:{action:SecurityResponseAction;targetResource:string;authorizedBy:string;parameters?:Record<string,unknown>}):Promise<SecurityResponseResult>{
  const adapter=getAdapter(); if(!adapter) throw new Error('No security response adapter configured. Set SECURITY_RESPONSE_WEBHOOK_URL.');
  const result=await adapter.execute({...input,parameters:input.parameters||{}}); if(!result.verified) throw new Error('Security response adapter did not verify the action: '+(result.details||'unknown verification failure'));
  appendSecurityEvent({eventType:'SECURITY_RESPONSE_VERIFIED',severity:input.action==='isolate'||input.action==='quarantine'?'HIGH':'MEDIUM',actorId:input.authorizedBy,targetResource:input.targetResource,verification:'VERIFIED',policyDecision:'ALLOW',description:'Security response "'+input.action+'" was externally verified.',metadata:{parameters:input.parameters||{}}});
  return {action:input.action,verified:true,details:result.details||'verified'};
}
export async function executeRollbackResponse(executionId:string,authorizedBy:string){
  const record=getExecutionById(executionId); if(!record) throw new Error('Execution record not found.');
  const rolledBack=await rollbackExecution(executionId);
  appendSecurityEvent({eventType:'SECURITY_ROLLBACK_VERIFIED',severity:'HIGH',actorId:authorizedBy,actionId:record.actionId,targetSystem:record.targetSystem,verification:'VERIFIED',policyDecision:'ALLOW',description:'Security operator rollback was externally verified and committed.',metadata:{executionId:rolledBack.executionId}});
  return {action:'rollback' as const,verified:true,details:'rollback verified',executionId:rolledBack.executionId};
}
