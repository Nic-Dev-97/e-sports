// Impotação ultiliznado o Modules
import Express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minutes";
import { convertMinutesToHourString } from "./utils/convert-minutes-to-hours-string";

// Função principal
const app = Express();
app.use(Express.json());
app.use(cors());

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

// Rota principal, com o parametro/metodo "get".
// O primeiro parametro, por exemplo, /ads é endereço que o usuario ira acessar, localhst3001/ads.
// O segundo parametro precisa ser uma função que sera executada quando o usuario acessar o endereço.
// request, serve para buscar as informaçoes que estão sendo requisitadas pelo usuraio.
// response, serve para devolver uma resposta para o usuario.

app.get("/games", async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  });
  return response.json(games);
});

app.post("/games/:id/ads", async (request, response) => {
const gameId = request.params.id;
const body: any = request.body;

const ad = await prisma.ad.create({
  data: {
    gameId,
    name: body.name,
    yearsPlaying: body.yearsPlaying,
    discord: body.discord,
    weekDays: body.weekDays.join(','),
    hourStart: convertHourStringToMinutes (body.hourStart),
    hourEnd: convertHourStringToMinutes (body.hourEnd),
    useVoiceChannel: body.useVoiceChannel,
  }
});
  return response.status(201).json(ad);
});

app.get("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return response.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd),
    }
  }));
});

app.get("/ads/:id/discord", async (request, response) => {
  const adId = request.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });
    
  return response.json({
    discord: ad.discord,
  });

});

app.listen(3333);
