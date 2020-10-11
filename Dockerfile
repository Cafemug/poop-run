FROM node:lts

WORKDIR /poop-run


COPY ./poop-run /poop-run
RUN node install

CMD ["node", "main.js"]
