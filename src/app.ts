import express from "express";
import cors from "cors";

import { uuid } from "uuidv4";

const app = express();

app.use(express.json());
app.use(cors());

interface CreateRepositories {
  id?: string;
  title: string;
  url: string;
  techs: string[];
  likes?: number;
}

const repositories: CreateRepositories[] = [];

const findIndex = (id: string) => repositories.findIndex((e) => e.id === id);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = findIndex(id);

  if (index < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  let newRepository = repositories[index];
  const repository = {
    id,
    title,
    url,
    techs,
    likes: newRepository.likes,
  };

  newRepository = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = findIndex(id);

  if (index < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = findIndex(id);

  if (index < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  let newRepository = repositories[index];
  const repository = {
    ...newRepository,
    likes: ++newRepository.likes,
  };

  newRepository = repository;

  return response.json(repository);
});

export default app;
