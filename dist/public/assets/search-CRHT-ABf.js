import{x as d,r as n,j as e,_ as c}from"./index-B3yLkj_P.js";const u={insurance:[{title:"Health Claim",icon:"🏥",link:"/health-claim"},{title:"Motor Accident",icon:"🚗",link:"/motor-claim"},{title:"Fire Claim",icon:"🔥",link:"/fire-claim"},{title:"Life Insurance",icon:"👥",link:"/life-claim"},{title:"Travel Claim",icon:"✈️",link:"/travel-claim"},{title:"Property Claim",icon:"🏠",link:"/property-claim"},{title:"Marine Claim",icon:"🚢",link:"/marine-claim"},{title:"Liability Claim",icon:"⚖️",link:"/liability-claim"}],loan:[{title:"Personal Loan",icon:"👤",link:"/personal-loan"},{title:"Home Loan",icon:"🏠",link:"/home-loan"},{title:"Business Loan",icon:"💼",link:"/business-loan"}],consumer:[{title:"Product Issues",icon:"📦",link:"/product-issues"},{title:"Service Quality",icon:"⭐",link:"/service-quality"},{title:"Billing Disputes",icon:"💳",link:"/billing-disputes"}]},x=Object.entries(u).flatMap(([s,t])=>t.map(i=>({...i,category:s})));function h(s){if(!s)return[];const t=s.toLowerCase();return x.filter(i=>i.title.toLowerCase().includes(t)||i.category.toLowerCase().includes(t))}function f(){const[s]=d(),[t,i]=n.useState([]),[r,o]=n.useState("");return n.useEffect(()=>{const a=new URLSearchParams(s.split("?")[1]).get("q")||"";if(o(a),a){const m=h(a);i(m)}},[s]),e.jsxs("div",{className:"container mx-auto px-4 py-8",children:[e.jsx("h1",{className:"text-3xl font-bold mb-6",children:"Search Results"}),r?e.jsxs(e.Fragment,{children:[e.jsxs("p",{className:"text-lg mb-8",children:[t.length," ",t.length===1?"result":"results",' for "',r,'"']}),t.length>0?e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",children:t.map(l=>e.jsx(c,{href:l.link,children:e.jsxs("a",{className:"flex flex-col items-center p-6 border rounded-lg hover:shadow-md transition-shadow bg-card",children:[e.jsx("span",{className:"text-4xl mb-3",children:l.icon}),e.jsx("span",{className:"text-base text-center font-medium mb-1",children:l.title}),e.jsx("span",{className:"text-xs text-center text-muted-foreground capitalize",children:l.category})]})},l.title))}):e.jsxs("div",{className:"text-center py-12",children:[e.jsx("p",{className:"text-xl mb-4",children:"No services found matching your search."}),e.jsx("p",{className:"text-muted-foreground mb-6",children:"Try searching for a different term or browse our services categories."}),e.jsx(c,{href:"/gogo",children:e.jsx("a",{className:"text-primary hover:underline",children:"Browse all services"})})]})]}):e.jsx("div",{className:"text-center py-12",children:e.jsx("p",{className:"text-xl",children:"Please enter a search term to find services."})})]})}export{f as default};
