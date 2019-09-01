module.exports = { hello };

async function hello(event) {
  return {
    statusCode: 200,
    body: JSON.stringify('Hello, world'),
  };
}
