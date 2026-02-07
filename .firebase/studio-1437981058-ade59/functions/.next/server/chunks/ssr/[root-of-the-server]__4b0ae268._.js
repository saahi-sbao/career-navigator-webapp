module.exports=[874,(a,b,c)=>{b.exports=a.x("buffer",()=>require("buffer"))},59639,(a,b,c)=>{b.exports=a.x("node:process",()=>require("node:process"))},12057,(a,b,c)=>{b.exports=a.x("node:util",()=>require("node:util"))},97699,a=>{"use strict";var b=a.i(37936),c=a.i(3859);a.i(62241);var d=a.i(18246),e=a.i(13095);let f=d.z.object({interests:d.z.array(d.z.string()).describe("The user's saved career interests.")}),g=d.z.object({suggestions:d.z.array(d.z.string()).describe("A list of personalized career suggestions.")});async function h(a){return j(a)}let i=c.ai.definePrompt({name:"personalizedCareerSuggestionsPrompt",input:{schema:f},output:{schema:g},prompt:`You are a career counselor providing personalized career suggestions.

  Based on the user's career interests, suggest relevant career paths.

  User's Interests: {{{interests}}}
  
  Please provide suggestions for a user with these interests.
  `}),j=c.ai.defineFlow({name:"personalizedCareerSuggestionsFlow",inputSchema:f,outputSchema:g},async a=>{let{output:b}=await i(a);return b});(0,e.ensureServerEntryExports)([h]),(0,b.registerServerReference)(h,"4046607924d157dc8d9d03d4b17f628586e93e345a",null),a.s([],64334),a.i(64334),a.s(["4046607924d157dc8d9d03d4b17f628586e93e345a",()=>h],97699)},41713,a=>{a.v(b=>Promise.all(["server/chunks/ssr/[root-of-the-server]__45e0fa2f._.js","server/chunks/ssr/[root-of-the-server]__a6e9808f._.js","server/chunks/ssr/[root-of-the-server]__6f62d038._.js"].map(b=>a.l(b))).then(()=>b(5477)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__4b0ae268._.js.map