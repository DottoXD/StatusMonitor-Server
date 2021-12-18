async function routes (fastify, options) {
  fastify.get("/", async (request, reply) => {
      let requestHost = request.headers.host;
        return reply.sendFile("index.html")
  })
}

module.exports = routes