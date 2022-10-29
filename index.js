const http = require('http');
const path = require('path');
const fs = require('fs/promises'); 

const PORT = 8000;

const app = http.createServer(async (request, response) => {
    const method =request.method;
    const url = request.url;
    if(url === '/tasks'){
        const jsonPath = path.resolve('./data.json');
        const jsonFile = await fs.readFile(jsonPath, 'utf8');
        if (method ==='GET'){
             response.setHeader("Content-Type", "application/json");
             response.write(jsonFile);
        }
        if (method === "POST") {
            console.log(request.body);
            request.on("data", async (data) => {
              const newTask = JSON.parse(data);
              const arr = JSON.parse(jsonFile);
              arr.push(newTask);
              console.log(arr);
              await fs.writeFile(jsonPath, JSON.stringify(arr));
              response.sendStatus(201);
            });
        }
        if (method === "PUT") {
            console.log(request.body);
            request.on("data", async (data) => {
                const arr = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
                const parse = JSON.parse(data);
                const {id, status} = parse;
                const taskIndex = arr.findIndex((task) => task.id === id);
                arr[taskIndex].status = status;
                await fs.writeFile(jsonPath, JSON.stringify(arr));
                response.sendStatus(200);
            });
        }
        if (method === "DELETE") {
            console.log(request.body);
            request.on("data", async (data) => {
                const arr = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
                const parse = JSON.parse(data);
                const {id} = parse;
                const taskIndex = arr.findIndex((task) => task.id === id);
                arr.splice(taskIndex, 1);
                await fs.writeFile(jsonPath, JSON.stringify(arr));
                response.sendStatus(200);
            });
        }
    }
     response.end();
})

app.listen(PORT);

console.log("servidor corriendo");
