@echo off
echo Initializing git repository...
git init

echo Creating README.md...
echo # portfolio-s > README.md

echo Adding files to git staging...
git add .

echo Committing files...
git commit -m "first commit"

echo Setting branch to main...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/shailgd34/portfolio-s.git

echo Pushing code to GitHub...
git push -u origin main

echo Pushing complete!
pause
