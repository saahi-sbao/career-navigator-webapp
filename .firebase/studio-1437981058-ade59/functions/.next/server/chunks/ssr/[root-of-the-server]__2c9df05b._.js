module.exports=[874,(a,b,c)=>{b.exports=a.x("buffer",()=>require("buffer"))},59639,(a,b,c)=>{b.exports=a.x("node:process",()=>require("node:process"))},12057,(a,b,c)=>{b.exports=a.x("node:util",()=>require("node:util"))},77176,a=>{"use strict";var b=a.i(37936),c=a.i(3859);a.i(62241);var d=a.i(18246),e=a.i(13095);let f=d.z.object({subjects:d.z.array(d.z.string()).min(3).describe("A list of subjects the student excels in.")}),g=d.z.object({reasoning:d.z.string().describe("A brief explanation of why the suggestions are a good fit for the subject combination."),recommendedCareers:d.z.array(d.z.string()).describe("A list of 5-7 specific career titles."),furtherStudies:d.z.array(d.z.string()).describe("A list of 3-5 relevant fields or degree programs for higher education.")});async function h(a){return j(a)}let i=c.ai.definePrompt({name:"subjectCombinationPrompt",input:{schema:f},output:{schema:g},prompt:`You are an expert career counselor for Kenyan high school students. Based on the following combination of subjects a student excels in, provide career and study recommendations relevant to the Kenyan context.

Student's Strong Subjects:
{{#each subjects}}
- {{{this}}}
{{/each}}

Please provide a brief reasoning, a list of recommended careers, and suggestions for further studies.
`}),j=c.ai.defineFlow({name:"subjectCombinationFlow",inputSchema:f,outputSchema:g},async a=>{let{output:b}=await i(a);if(!b)throw Error("Failed to get suggestions from the AI model.");return b});(0,e.ensureServerEntryExports)([h]),(0,b.registerServerReference)(h,"40f5828bb39ade3bf78c6db634800013e3418a5d95",null),a.s([],2155),a.i(2155),a.s(["40f5828bb39ade3bf78c6db634800013e3418a5d95",()=>h],77176)},41713,a=>{a.v(b=>Promise.all(["server/chunks/ssr/[root-of-the-server]__d12303a4._.js","server/chunks/ssr/[root-of-the-server]__a6e9808f._.js","server/chunks/ssr/[root-of-the-server]__6f62d038._.js"].map(b=>a.l(b))).then(()=>b(5477)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__2c9df05b._.js.map