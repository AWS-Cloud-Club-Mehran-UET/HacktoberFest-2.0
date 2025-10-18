# 🧭 Git Workflow – How to Work and Submit Your Project

This guide explains exactly how your team should fork, clone, collaborate, and submit your project to the main hackathon repository. **All setup and submission steps must be performed by the Team Lead only.**

---

## ⚙️ Step 1: Fork the Repository (Only Team Lead)

1. Only the **Team Lead** should fork the main hackathon repository from the official repo page.  
2. Click **“Fork”** (top-right corner) to create a copy of the repository in your GitHub account.  
3. You will now have your own version of the repo under your username. This member becomes the **Team Repository Owner**.

---

## 👥 Step 2: Add Your Team Members as Collaborators (Team Lead Only)

After forking, the **Team Lead** must add all teammates as collaborators:

1. Go to your forked repository on GitHub.  
2. Navigate to **Settings → Collaborators and teams**.  
3. Click **Add people** and enter your teammates’ GitHub usernames.  
4. They will receive an invite — once accepted, they can clone and push to your fork.

---

## 💻 Step 3: Clone Your Fork Locally (Team Lead)

The **Team Lead** should clone the forked repository to their system:

```bash
git clone https://github.com/<your-username>/<repository-name>.git
cd <repository-name>
```

This allows the team to start working locally on their code.

---

## 🌱 Step 4: Create Your Team Branch (Team Lead)

Each team must work on a **dedicated branch** named after their team.

```bash
git checkout -b team-<team-name>
```

**Example:**
```bash
git checkout -b team-alpha
```

---

## 📁 Step 5: Create Your Team Folder and README (Team Lead)

Inside the `submission` directory, create a folder using your **team name**:

```
/submission/team-alpha/
```

Inside your folder:
- Add all your project files, documentation, and assets.  
- Create a `README.md` with the following details:
  - Team Name  
  - Team Members and Roles  
  - Project Title and Description  
  - Technologies Used  
  - Setup Instructions (if any)

Example:
```
submission/
└── team-alpha/
    ├── README.md
    ├── src/
    └── assets/
```

Once done, the **Team Lead** should commit and push these changes before inviting team members to contribute.

---

## 💮 Step 6: Add and Commit Your Changes (Team Lead)

After setting up the structure, the Team Lead should commit the initial setup:

```bash
git add .
git commit -m "Initial setup for team-alpha with folder and README"
```

Use descriptive commit messages that explain what you’ve done.

---

## 🚀 Step 7: Push Your Branch to GitHub (Team Lead)

Push your branch to your forked repository:

```bash
git push origin team-alpha
```

Now your branch is available remotely for all team members to work on.

---

## 🔄 Step 8: Collaborate with Your Team

After the initial setup by the **Team Lead**, all team members can start working collaboratively:

1. Pull the latest team branch before working:
   ```bash
   git pull origin team-alpha
   ```
2. Work on assigned sections of the project.
3. Add and commit changes:
   ```bash
   git add .
   git commit -m "Added feature by member2"
   ```
4. Push changes:
   ```bash
   git push origin team-alpha
   ```

If conflicts arise, resolve them locally and commit again.

---


## 🧩 Step 9: Submit via Pull Request (PR) – Team Lead Only

Once your team finalizes the project, the **Team Lead** must submit the project:

1. Go to your forked repository on GitHub.  
2. Click **Compare & Pull Request.**  
3. Set the **base branch** as `submission` (in the main repo).  
4. Add a clear and meaningful PR title and description.  
   **Example:** `[Team Alpha] Final Submission – Smart Energy Saver App`  
5. Click **Create Pull Request.**


---

## 🏁 Step 10: Final Submission Checklist (Team Lead)

✅ Project is inside `/submission/team-name/`  
✅ Branch name matches your team (e.g., `team-alpha`)  
✅ Pull Request made to `submission` branch  
✅ All commits pushed before the deadline  
✅ All team members added as collaborators  
✅ No merge conflicts  
✅ Setup completed by Team Lead only  

---

## 🧠 Common Git Commands (Cheat Sheet)

| Task | Command |
|------|----------|
| Clone repo | `git clone <url>` |
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| Add changes | `git add .` |
| Commit changes | `git commit -m "message"` |
| Push branch | `git push origin branch-name` |
| Pull updates | `git pull origin branch-name` |
| Sync with main repo | `git fetch upstream && git merge upstream/submission` |

