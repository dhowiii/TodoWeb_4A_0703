(() => {
  const input = document.getElementById('inputTask');
  const inputDate = document.getElementById('inputDate');
  const btnTambah = document.getElementById('btnTambahTodo');
  const list = document.getElementById('listTugas');
  const selectStatus = document.getElementById('selectStatus');

  if (!input || !btnTambah || !list || !selectStatus || !inputDate) {
    // Jika markup berubah, script.js tidak akan crash.
    return;
  }

  const STORAGE_KEY = 'todoList';

  const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

  // Load todos dari localStorage
  function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Save todos ke localStorage
  function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function createTodoItem({ id, text, date = '', status = 'Belum' }) {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const textContainer = document.createElement('div');
    textContainer.className = 'todo-text-container';

    const pText = document.createElement('div');
    pText.className = 'todo-text';
    pText.textContent = text;

    const pDate = document.createElement('div');
    pDate.className = 'todo-date';
    pDate.textContent = date ? new Date(date).toLocaleDateString('id-ID') : '-';

    textContainer.appendChild(pText);
    textContainer.appendChild(pDate);

    const statusPill = document.createElement('div');
    statusPill.className = 'todo-status';
    statusPill.textContent = status;

    // Buttons
    const btnToggle = document.createElement('button');

    btnToggle.className = 'btn btn-status';
    btnToggle.type = 'button';
    btnToggle.textContent = status === 'Selesai' ? 'Kembalikan' : 'Selesai';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn btn-edit';
    btnEdit.type = 'button';
    btnEdit.textContent = 'Edit';

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-delete';
    btnDelete.type = 'button';
    btnDelete.textContent = 'Hapus';

    li.dataset.id = id;
    li.dataset.date = date;

    // Arrange: sesuai CSS, gunakan layout grid. Kita buat struktur sederhana.
    // CSS yang ada mengatur beberapa elemen dengan child selector.
    li.appendChild(textContainer);
    li.appendChild(statusPill);

    // Agar CSS layout tweak-nya tetap enak, tombol dibuat sebagai child langsung.
    li.appendChild(btnToggle);
    li.appendChild(btnEdit);
    li.appendChild(btnDelete);


    function setStatus(nextStatus) {
      status = nextStatus;
      statusPill.textContent = status;
      btnToggle.textContent = status === 'Selesai' ? 'Kembalikan' : 'Selesai';
    }

    function startEdit() {
      // Create edit container
      const editContainer = document.createElement('div');
      editContainer.className = 'edit-container';

      const fieldGroup1 = document.createElement('div');
      fieldGroup1.className = 'edit-field-group';
      const label1 = document.createElement('label');
      label1.textContent = 'Kegiatan:';
      label1.className = 'edit-label';
      const inputEdit = document.createElement('input');
      inputEdit.type = 'text';
      inputEdit.value = pText.textContent;
      inputEdit.className = 'edit-input';
      fieldGroup1.appendChild(label1);
      fieldGroup1.appendChild(inputEdit);

      const fieldGroup2 = document.createElement('div');
      fieldGroup2.className = 'edit-field-group';
      const label2 = document.createElement('label');
      label2.textContent = 'Tanggal:';
      label2.className = 'edit-label';
      const inputEditDate = document.createElement('input');
      inputEditDate.type = 'date';
      inputEditDate.value = date;
      inputEditDate.className = 'edit-input';
      fieldGroup2.appendChild(label2);
      fieldGroup2.appendChild(inputEditDate);

      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'edit-button-group';
      
      const btnSave = document.createElement('button');
      btnSave.type = 'button';
      btnSave.className = 'btn btn-save';
      btnSave.textContent = '✓ Simpan';

      const btnCancel = document.createElement('button');
      btnCancel.type = 'button';
      btnCancel.className = 'btn btn-cancel';
      btnCancel.textContent = '✕ Batal';

      buttonGroup.appendChild(btnSave);
      buttonGroup.appendChild(btnCancel);

      editContainer.appendChild(fieldGroup1);
      editContainer.appendChild(fieldGroup2);
      editContainer.appendChild(buttonGroup);

      li.replaceChild(editContainer, textContainer);

      inputEdit.focus();
      inputEdit.select();

      function saveEdit() {
        const newText = inputEdit.value.trim();
        const newDate = inputEditDate.value;
        if (newText) {
          text = newText;
          date = newDate;
          pText.textContent = text;
          pDate.textContent = newDate ? new Date(newDate).toLocaleDateString('id-ID') : '-';
          li.dataset.date = newDate;
        }
        li.replaceChild(textContainer, editContainer);
        saveTodoToStorage();
      }

      function cancelEdit() {
        li.replaceChild(textContainer, editContainer);
      }

      inputEdit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveEdit();
        } else if (e.key === 'Escape') {
          cancelEdit();
        }
      });

      inputEditDate.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveEdit();
        } else if (e.key === 'Escape') {
          cancelEdit();
        }
      });

      btnSave.addEventListener('click', saveEdit);
      btnCancel.addEventListener('click', cancelEdit);
      inputEdit.addEventListener('blur', saveEdit);
    }

    function saveTodoToStorage() {
      const todos = loadTodos();
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.text = text;
        todo.date = date;
        todo.status = status;
        saveTodos(todos);
      }
    }

    btnToggle.addEventListener('click', () => {
      setStatus(status === 'Selesai' ? 'Belum' : 'Selesai');
      saveTodoToStorage();
    });

    btnEdit.addEventListener('click', startEdit);

    btnDelete.addEventListener('click', () => {
      const todos = loadTodos();
      const filtered = todos.filter(t => t.id !== id);
      saveTodos(filtered);
      li.remove();
    });



    return li;
  }

  function addTodo() {
    const value = input.value.trim();
    const dateValue = inputDate.value;
    if (!value) return;

    const todo = {
      id: uid(),
      text: value,
      date: dateValue,
      status: selectStatus.value === 'Selesai' ? 'Selesai' : 'Belum'
    };

    const todos = loadTodos();
    todos.push(todo);
    saveTodos(todos);

    list.appendChild(createTodoItem(todo));
    input.value = '';
    inputDate.value = '';
    input.focus();
  }

  function loadAllTodos() {
    const todos = loadTodos();
    list.innerHTML = '';
    todos.forEach(todo => {
      list.appendChild(createTodoItem(todo));
    });
  }

  btnTambah.addEventListener('click', addTodo);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
  });

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  inputDate.value = today;

  // Load todos saat halaman dimuat
  loadAllTodos();
})();

