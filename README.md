##Cutest - Which Pokemon is the cutest?
Voting Application which utilises tRPC's features to efficiently linked the database and front-end

##URL
*`https://pokemon-app-git-main-cowpeeonyou.vercel.app`*


## Technologies Used
<ul>
<li> NextJS
<li> TypeScript
<li> Prisma
<li> MySQL
<li> TailwindCSS
<li> tRPC
</ul>

## Getting Started

Required dependencies:
	<li> MySQL database
	<li> npm
	
How to Set Up:
<ol>
<li> Clone repo
<li> **`npm install`**
<li> **`.env`** file should be configured for **`DATABASE_URL` **and **`SHADOW_URL`**
<li> Initiate Prisma **`npx prisma migrate dev`**
<li> Run script to hydrate the database **`npm run ts-node ./scripts/fill-db.ts`**
<li> **`npm run dev`**
</ol>

