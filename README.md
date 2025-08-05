
# 🚀 QUICKSTART - GitHub Flow دليل العمل الجماعي

هذا الملف يرشد أعضاء الفريق لكيفية البدء باستخدام GitHub Flow في المشروع، خطوة بخطوة.

---

## 📥 1. استنساخ المشروع (Clone Repository)

```bash
git clone https://github.com/<team-name>/<repo-name>.git
cd <repo-name>
```

---

## 🔄 2. تحديث الفرع الرئيسي (main)

```bash
git checkout main
git pull origin main
```

---

## 🌿 3. إنشاء فرع جديد للمهمة

```bash
git checkout -b feature/اسم-المهمة
```

---

## 🧠 4. تنفيذ التعديلات والرفع

```bash
git add .
git commit -m "feat: وصف قصير لما تم"
git push origin feature/اسم-المهمة
```

---

## 🔃 5. فتح Pull Request

- من GitHub: افتح PR من `feature/...` إلى `main`.
- ضع عنوان ووصف واضح.
- انتظر المراجعة من القائد أو الزملاء.

---

## 🌱 قواعد تسمية الفروع

| النوع       | الصيغة                        |
|------------|-------------------------------|
| ميزة جديدة | `feature/login-page`          |
| إصلاح خطأ  | `bugfix/fix-button-alignment` |
| تعديل طارئ | `hotfix/deploy-issue`         |

---

✅ **تذكير مهم**:
- لا تعدل على `main` مباشرة.
- كل مهمة يجب أن تكون في فرع منفصل.
- لا تدمج Pull Request قبل مراجعته من الآخرين.



## 📘 How to Use the Todo List with Redux + Supabase in Your Components

### ✅ 1. Get the `user_id` from Supabase Auth
```js
import { supabase } from "@/lib/supabase";

const { data: { user } } = await supabase.auth.getUser();
const userId = user?.id;
```

**OR in React:**
```js
useEffect(() => {
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id);
  };
  fetchUser();
}, []);
```

---

### ✅ 2. Fetch todos, categories, and priorities
```js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  createTodo,
  editTodo,
  removeTodo,
  fetchCategories,
  fetchPriorities,
} from "@/store/reducers/todoSlice";

useEffect(() => {
  if (userId) {
    dispatch(fetchTodos(userId));
    dispatch(fetchCategories());
    dispatch(fetchPriorities());
  }
}, [userId]);
```

---

### ✅ 3. Add a new todo
```js
const newTodo = {
  title: "Example Title",
  description: "Details...",
  due_date: "2025-08-10",
  status: "todo",
  category_id: 1,
  priority_id: 2,
};

dispatch(createTodo({ todo: newTodo, userId }));
```

---

### ✅ 4. Update a todo
```js
dispatch(editTodo({ id: todoId, updates: { title: "Updated" } }));
```

---

### ✅ 5. Delete a todo
```js
dispatch(removeTodo(todoId));
```

---

### ✅ 6. Access data in components
```js
const { items: todos, categories, priorities, status } = useSelector(
  (state) => state.todos
);
```

---

### ✅ 7. `.env` Setup (Important!)
Make sure your team adds a `.env` file in the root of the project with the following:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

