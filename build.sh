docker build -t volume-updater .
docker run \
  --volume browsify:/data \
  --rm \
  volume-updater \
  bash -c 'cp -r /web/build/* /data/.'
