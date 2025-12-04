const gitCommands = {
  // setup & configuration
  setup: {
    color: "#3B82F6",
    commands: [
      'git config --global user.name "Your Name"',
      'git config --global user.email "your@email.com"',
      'git config --list',
      'git config --global core.editor "code --wait"',
      'git config --global alias.st status'
    ]
  },

  // initialize & clone
  initialize: {
    color: "#8B5CF6",
    commands: [
      'git init',
      'git clone <repo-url>',
      'git clone <repo-url> <folder-name>'
    ]
  },

  // status & info
  status: {
    color: "#c0c8d6ff",
    commands: [
      'git status',
      'git show',
      'git show <commit>',
      'git describe --tags',
      'git rev-parse HEAD'
    ]
  },

  // add / stage
  add: {
    color: "#34D399",
    commands: [
      'git add <file>',
      'git add .',
      'git add -A',
      'git add -p'
    ]
  },

  // commit
  commit: {
    color: "#F59E0B",
    commands: [
      'git commit -m "wip"',
      'git commit -am "bla-bla-bla"',
      'git commit --amend',
      'git commit --amend -m "new message"',
      'git commit --allow-empty -m "empty commit"'
    ]
  },

  // push 
  push: {
    color: "#06B6D4",
    commands: [
      'git push',
      'git push origin main',
      'git push -u origin main',
      'git push --force',
      'git push --tags',
      'git push origin --delete <branch>'
    ]
  },

  // pull / fetch 
  pull: {
    color: "#6366F1",
    commands: [
      'git pull',
      'git pull origin main',
      'git pull --rebase',
      'git fetch',
      'git fetch --all',
      'git fetch origin'
    ]
  },

  // branch
  branch: {
    color: "#FB923C",
    commands: [
      'git branch',
      'git branch <name>',
      'git branch -d <name>',
      'git branch -D <name>',
      'git branch -m <old> <new>',
      'git branch -a',
      'git branch -r',
      'git branch --merged',
      'git branch --no-merged'
    ]
  },

  // switch / checkout
  checkout: {
    color: "#EC4899",
    commands: [
      'git checkout <branch>',
      'git checkout -b "fixing-bugs"',
      'git checkout <commit>',
      'git switch <branch>',
      'git switch -c <new-branch>'
    ]
  },

  // merge & rebase 
  merge: {
    color: "#9333EA",
    commands: [
      'git merge <branch>',
      'git merge --no-ff <branch>',
      'git merge --abort',
      'git rebase <branch>',
      'git rebase -i HEAD~3',
      'git rebase --continue',
      'git rebase --abort'
    ]
  },

  // log & history
  log: {
    color: "#D97706",
    commands: [
      'git log',
      'git log --oneline',
      'git log --graph',
      'git log --stat',
      'git log --since="2 weeks ago"',
      'git log --author="name"',
      'git log -p'
    ]
  },

  // diff 
  diff: {
    color: "#84CC16",
    commands: [
      'git diff',
      'git diff --staged',
      'git diff HEAD',
      'git diff branch1..branch2'
    ]
  },

  // reset & clean
  reset: {
    color: "#EF4444",
    commands: [
      'git reset',
      'git reset <file>',
      'git reset --hard',
      'git reset --soft HEAD~1',
      'git clean -n',
      'git clean -f'
    ]
  },

  // revert & restore 
  revert: {
    color: "#FDE047",
    commands: [
      'git revert <commit>',
      'git restore <file>',
      'git restore --staged <file>',
      'git restore .'
    ]
  },

  // stash
  stash: {
    color: "#14B8A6",
    commands: [
      'git stash',
      'git stash list',
      'git stash apply',
      'git stash drop',
      'git stash pop',
      'git stash clear',
      'git stash show -p stash@{0}'
    ]
  },

  // tag
  tag: {
    color: "#FFFFFF",
    commands: [
      'git tag',
      'git tag <name>',
      'git tag -a <name> -m "message"',
      'git tag -d <name>',
      'git push origin <tag>',
      'git push origin --tags'
    ]
  },

  // remote
  remote: {
    color: "#7C3AED",
    commands: [
      'git remote',
      'git remote -v',
      'git remote add origin <url>',
      'git remote remove origin',
      'git remote rename origin upstream',
      'git remote set-url origin <new-url>'
    ]
  },

  // blame / show / reflog
  blame: {
    color: "#FB7185",
    commands: [
      'git blame <file>',
      'git blame -L 10,20 <file>',
      'git reflog',
      'git reflog show <branch>'
    ]
  },

  // cherry-pick & bisect
  cherry: {
    color: "#BE123C",
    commands: [
      'git cherry-pick <commit>',
      'git cherry-pick --abort',
      'git bisect start',
      'git bisect bad',
      'git bisect good <commit>',
      'git bisect reset'
    ]
  },

  // remove / move 
  remove: {
    color: "#757779ff",
    commands: [
      'git rm <file>',
      'git rm --cached <file>',
      'git mv <old> <new>'
    ]
  },

  // archive & submodules
  archive: {
    color: "#059669",
    commands: [
      'git archive --format=zip HEAD > project.zip',
      'git submodule add <repo> <path>',
      'git submodule update --init --recursive',
      'git submodule deinit -f .'
    ]
  }
};

// all commands into single array with colors
const allCommands = [];

for (const category in gitCommands) {
  gitCommands[category].commands.forEach(cmd => {
    allCommands.push({
      text: cmd,
      color: gitCommands[category].color,
      category: category
    });
  });
}

const availableCommands = [...allCommands];

// function to get random command
function getRandomCommand() {
  if (availableCommands.length === 0) return null;

  const index = Math.floor(Math.random() * availableCommands.length);
  const selected = availableCommands[index];
  availableCommands.splice(index, 1);

  return selected;
}