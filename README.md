# Instructions

1. Install redis with
```bash
docker run -p 6379:6379 --name redis redis 
```

2. Add test data to redis
```bash
# If docker then
# docker exec -it redis /bin/sh
redis-cli
LPUSH tasks "Go Food Shopping"
LPUSH tasks "Dinner With Family"
LPUSH tasks "Meeting At Work"
hmset 'call' name "John Doe"
hmset 'call' phone "655-555-5555"
hmset 'call' company "Acme"
hmset 'call' time "05-08-2019"
# confirm with
# LRANGE tasks 0 -1
```

3. Execute
```bash
npm install
# mkdir views && cd views && touch index.js
npm run dev
```
