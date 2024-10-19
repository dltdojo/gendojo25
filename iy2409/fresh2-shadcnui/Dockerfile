FROM denoland/deno:2.0.2

USER deno
# Set the working directory inside the container
WORKDIR /app

ADD src /app/src
ADD deno.json /app/
ADD cli.sh /app/
#
# docker build -t foo .
# docker run --rm -it -p 8000:8000 foo
#
CMD [ "sleep","1000"]