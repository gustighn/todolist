import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const storedItems = JSON.parse(localStorage.getItem("todoItems"));
      if (Array.isArray(storedItems)) {
        setItems(storedItems);
      }
    } catch (error) {
      console.error("Gagal memuat data dari localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("todoItems", JSON.stringify(items));
    } else {
      localStorage.removeItem("todoItems"); // bersihkan jika kosong
    }
  }, [items]);

  const addItem = (newItem) => {
    if (newItem.trim() !== "") {
      setItems([...items, { id: uuidv4(), text: newItem, isEditing: false }]);
    }
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const startEdit = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isEditing: true } : item))
    );
  };

  const saveEdit = (id, newText) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { text: newText, isEditing: false, id } : item
      )
    );
  };

  return (
    <div className="App">
      <Container
        items={items}
        addItem={addItem}
        deleteItem={deleteItem}
        startEdit={startEdit}
        saveEdit={saveEdit}
      />
    </div>
  );
}

function Container({ items, addItem, deleteItem, startEdit, saveEdit }) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => setInputValue(e.target.value);
  const handleClick = () => {
    addItem(inputValue);
    setInputValue("");
  };

  return (
    <>
      <h1 className="text-6xl font-[1000] font-serif mt-10 text-slate-700 text-center tracking-[5px] lg:tracking-[10px]">
        TUGAS
      </h1>
      <div className="w-[90%] lg:w-4/5 h-[600px] lg:h-[440px] mx-auto rounded-3xl mt-10 bg-gray-100 py-10 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.25)]">
        <label className="relative">
          <input
            placeholder="Tambah Item"
            className="py-2 px-4 w-[90%] h-14 lg:w-[400px] bg-white rounded-full pr-12 shadow-sm tracking-normal"
            value={inputValue}
            onChange={handleChange}
          />
          <svg
            className="absolute top-0 right-4 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#434343"
            onClick={handleClick}
          >
            <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
          </svg>
        </label>

        <div className="items__container h-[420px] lg:h-[280px] mt-12 flex flex-col gap-2 overflow-y-auto scrollbar-hide snap-y snap-mandatory pb-0.5">
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
              deleteItem={deleteItem}
              startEdit={startEdit}
              saveEdit={saveEdit}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Item({ item, deleteItem, startEdit, saveEdit }) {
  const [editText, setEditText] = useState(item.text);

  return (
    <div className="fade-in w-[90%] lg:w-[400px] mx-auto bg-white h-11 min-h-[44px] rounded-full shadow-sm text-slate-600 px-4 flex items-center justify-between snap-start">
      {item.isEditing ? (
        <input
          className="w-full bg-transparent outline-none truncate h-full"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => saveEdit(item.id, editText)}
        />
      ) : (
        <span className="truncate max-w-[250px] leading-[44px]">
          {item.text}
        </span>
      )}

      <div className="flex gap-2 items-center">
        <span onClick={() => startEdit(item.id)} className="cursor-pointer">
          {/* Ikon Edit */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#434343"
          >
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
          </svg>
        </span>
        <span onClick={() => deleteItem(item.id)} className="cursor-pointer">
          {/* Ikon Hapus */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#434343"
          >
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
