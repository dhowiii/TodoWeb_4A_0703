(() => {
  const input = document.getElementById('inputTask');
  const btnTambah = document.getElementById('btnTambahTodo');
  const list = document.getElementById('listTugas');
  const selectStatus = document.getElementById('selectStatus');

  if (!input || !btnTambah || !list || !selectStatus) {
    // Jika markup berubah, script.js tidak akan crash.
    return;
  }


  const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

  function createTodoItem({ id, text, status = 'Belum' }) {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const pText = document.createElement('div');
    pText.className = 'todo-text';
    pText.textContent = text;

    const statusPill = document.createElement('div');
    statusPill.className = 'todo-status';
    statusPill.textContent = status;

    // Buttons
    const btnToggle = document.createElement('button');

    btnToggle.className = 'btn btn-status';
    btnToggle.type = 'button';
    btnToggle.textContent = status === 'Selesai' ? 'Kembalikan' : 'Selesai';

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-delete';
    btnDelete.type = 'button';
    btnDelete.textContent = 'Hapus';

    li.dataset.id = id;

    // Arrange: sesuai CSS, gunakan layout grid. Kita buat struktur sederhana.
    // CSS yang ada mengatur beberapa elemen dengan child selector.
    li.appendChild(pText);
    li.appendChild(statusPill);

    // Agar CSS layout tweak-nya tetap enak, tombol dibuat sebagai child langsung.
    li.appendChild(btnToggle);
    li.appendChild(btnDelete);


    function setStatus(nextStatus) {
      status = nextStatus;
      statusPill.textContent = status;
      btnToggle.textContent = status === 'Selesai' ? 'Kembalikan' : 'Selesai';
    }

    btnToggle.addEventListener('click', () => {
      setStatus(status === 'Selesai' ? 'Belum' : 'Selesai');
    });

    btnDelete.addEventListener('click', () => {
      li.remove();
    });



    return li;
  }

  function addTodo() {
    const value = input.value.trim();
    if (!value) return;

    const todo = {
      id: uid(),
      text: value,
      status: selectStatus.value === 'Selesai' ? 'Selesai' : 'Belum'
    };


    list.appendChild(createTodoItem(todo));
    input.value = '';
    input.focus();
  }

  btnTambah.addEventListener('click', addTodo);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
  });
})();

