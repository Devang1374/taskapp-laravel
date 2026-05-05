const BASE_URL = "http://127.0.0.1:8000/api";

    let editingTaskId = null;

    /* shared header helpers */
    const AUTH      = () => ({ "Authorization": "Bearer " + localStorage.getItem("token") });
    const AUTH_JSON = () => ({ ...AUTH(), "Content-Type": "application/json" });

    /* set today's date */
    document.getElementById('today-date').textContent =
      new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

    window.onload = getTasks;

    /* ═══════════════════════════════════════════
       CREATE — POST /api/task  { title }
    ═══════════════════════════════════════════ */
    async function createTask() {
      const titleEl = document.getElementById("title");
      const title   = titleEl.value.trim();
      if (!title) return;

      try {
        const res  = await fetch(BASE_URL + '/task', {
          method:  "POST",
          headers: AUTH_JSON(),
          body:    JSON.stringify({ title })
        });
        const data = await res.json();
        alert(data.message);
        titleEl.value = '';
        getTasks();
      } catch (err) {
        alert("Failed to create task.");
        console.error(err);
      }
    }

    /* ═══════════════════════════════════════════
       READ — GET /api/task
    ═══════════════════════════════════════════ */
    async function getTasks() {
      if (!localStorage.getItem("token")) {
        window.location.href = "index.html";
        return;
      }

      const spinIcon = document.getElementById('spin-icon');
      spinIcon.style.animation = 'spin 0.6s linear infinite';

      try {
        const res  = await fetch(BASE_URL + '/task', {
          method:  "GET",
          headers: AUTH()
        });
        const data = await res.json();
        renderTasks(data.task);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        spinIcon.style.animation = '';
      }
    }

    function renderTasks(tasks) {
      const list  = document.getElementById('task-list');
      const empty = document.getElementById('empty-msg');

      /* status returned by API: "Complete" or "panding" */
      const doneCount = tasks.filter(t => t.status === "Complete").length;
      const leftCount = tasks.length - doneCount;

      document.getElementById('s-total').textContent = tasks.length;
      document.getElementById('s-done').textContent  = doneCount;
      document.getElementById('s-left').textContent  = leftCount;
      document.getElementById('remaining-text').textContent =
        leftCount === 1 ? '1 task' : leftCount + ' tasks';

      list.innerHTML = '';

      if (!tasks.length) { empty.style.display = 'block'; return; }
      empty.style.display = 'none';

      tasks.forEach(task => {
        const isDone = task.status === "Complete";
        const div    = document.createElement('div');
        div.className = 'task-item' + (isDone ? ' done' : '');

        div.innerHTML = `
          <div class="check-btn" onclick="completeTask(${task.id})" title="Mark complete">✓</div>
          <span class="task-text">${escapeHTML(task.title)}</span>
          <button class="edit-btn" onclick="openEditModal(${task.id}, '${escapeAttr(task.title)}')" title="Edit task">✏️ Edit</button>
          <button class="del-btn"  onclick="deleteTask(${task.id})" title="Delete task">✕</button>
        `;
        list.appendChild(div);
      });
    }

    /* ═══════════════════════════════════════════
       COMPLETE — POST /api/task/:id
    ═══════════════════════════════════════════ */
    async function completeTask(id) {
      try {
        await fetch(BASE_URL + '/task/' + id, {
          method:  "POST",
          headers: AUTH()
        });
        getTasks();
      } catch (err) {
        console.error("Failed to mark task complete:", err);
      }
    }

    /* ═══════════════════════════════════════════
       EDIT MODAL
    ═══════════════════════════════════════════ */
    function openEditModal(id, currentTitle) {
      editingTaskId = id;
      document.getElementById('edit-title-input').value = currentTitle;
      document.getElementById('edit-modal').classList.add('open');
      setTimeout(() => document.getElementById('edit-title-input').focus(), 50);
    }

    function closeEditModal(event) {
      if (event && event.target !== document.getElementById('edit-modal')) return;
      document.getElementById('edit-modal').classList.remove('open');
      editingTaskId = null;
    }

    /* UPDATE — PUT /api/task/:id  { title } */
    async function saveEdit() {
      const newTitle = document.getElementById('edit-title-input').value.trim();
      if (!newTitle) { alert("Title cannot be empty."); return; }

      try {
        const res  = await fetch(BASE_URL + '/task/' + editingTaskId, {
          method:  "PUT",
          headers: AUTH_JSON(),
          body:    JSON.stringify({ title: newTitle })
        });
        const data = await res.json();
        alert(data.message);
        document.getElementById('edit-modal').classList.remove('open');
        editingTaskId = null;
        getTasks();
      } catch (err) {
        alert("Failed to update task.");
        console.error(err);
      }
    }

    /* ═══════════════════════════════════════════
       DELETE — DELETE /api/task/:id
    ═══════════════════════════════════════════ */
    async function deleteTask(id) {
      if (!confirm("Delete this task?")) return;

      try {
        const res  = await fetch(BASE_URL + '/task/' + id, {
          method:  "DELETE",
          headers: AUTH()
        });
        const data = await res.json();
        alert(data.message);
        getTasks();
      } catch (err) {
        alert("Failed to delete task.");
        console.error(err);
      }
    }

    /* ═══════════════════════════════════════════
       LOGOUT
    ═══════════════════════════════════════════ */
    function logout() {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }

    /* ═══════════════════════════════════════════
       HELPERS – prevent XSS
    ═══════════════════════════════════════════ */
    function escapeHTML(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function escapeAttr(str) {
      return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }