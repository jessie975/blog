#!/usr/bin/env sh

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

echo 'jessie.i7xy.cn' > CNAME

git init
git config --local user.email "1185922395@qq.com"
git config --local user.name "jessie"
git add -A
git commit -m 'deploy'

git push -f git@github.com:jessie975/blog.git master:gh-pages

cd -