module.exports=[874,(a,b,c)=>{b.exports=a.x("buffer",()=>require("buffer"))},59639,(a,b,c)=>{b.exports=a.x("node:process",()=>require("node:process"))},12057,(a,b,c)=>{b.exports=a.x("node:util",()=>require("node:util"))},98399,a=>{"use strict";var b=a.i(37936),c=a.i(3859);a.i(62241);var d=a.i(18246),e=a.i(13095);let f=d.z.object({subject:d.z.string(),duration:d.z.number().describe("Duration in minutes"),date:d.z.string().describe("ISO 8601 date string")}),g=d.z.object({pathway:d.z.string().describe("The student's recommended career pathway (e.g., STEM, Social Sciences)."),studyLogs:d.z.array(f).describe("A list of recent study sessions.")}),h=d.z.object({recommendations:d.z.array(d.z.string()).describe("A list of 2-3 concise, actionable study recommendations.")});async function i(a){return k(a)}let j=c.ai.definePrompt({name:"studyRecommendationsPrompt",input:{schema:g},output:{schema:h},prompt:`You are an academic advisor for a Kenyan student. Your goal is to provide personalized study recommendations.

Analyze the student's recommended career pathway and their recent study logs.

- Student's Pathway: {{{pathway}}}
- Recent Study Logs:
{{#each studyLogs}}
  - Studied {{subject}} for {{duration}} minutes on {{date}}.
{{/each}}
{{#if (eq studyLogs.length 0)}}
  - No study sessions logged yet.
{{/if}}

Based on this information, provide 2-3 concise, actionable recommendations. Focus on subjects that are crucial for their pathway but may be getting less attention. If no logs exist, provide general advice for their pathway. Frame your recommendations in an encouraging and supportive tone.
`}),k=c.ai.defineFlow({name:"studyRecommendationsFlow",inputSchema:g,outputSchema:h},async a=>{let{output:b}=await j(a);return b});(0,e.ensureServerEntryExports)([i]),(0,b.registerServerReference)(i,"40eeac7745c8a88eabede0d78689bba581f2533d5a",null),a.s([],5881),a.i(5881),a.s(["40eeac7745c8a88eabede0d78689bba581f2533d5a",()=>i],98399)},41713,a=>{a.v(b=>Promise.all(["server/chunks/ssr/[root-of-the-server]__773e4913._.js","server/chunks/ssr/[root-of-the-server]__a6e9808f._.js","server/chunks/ssr/[root-of-the-server]__6f62d038._.js"].map(b=>a.l(b))).then(()=>b(5477)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__721aadfc._.js.map