import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [loading, setLoading] = useState(false);
  const [text, setText] = React.useState(" ");
  const [title, setTitle] = useState(" ");
  const [imageUrl, setImageUrl] = useState(" ");
  const [tags, setTags] = useState(" ");
  const inputfILERef = useRef(null);
  const isEditing = Boolean(id);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("File yuklemek ugursuz oldu!");
    }
  };

  const onClickRemoveImage = () => {
    if (imageUrl) {
      alert("Silmək istədiyinizdən əminsiniz mi?");
    }
    if (imageUrl) {
      setImageUrl("");
    }
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn("Xəta! Məqalə yarada bilmədi");
    }
  };

  // Burada useParams()sı ona göre istifadə edirik ki login oldugumuz user ile yarattigimiz postu redaktiv yani deyismek   istədiyimizdə
  // daxil olduğumuz id ilə sorğu göndərsin backende
  // Sorğuda hansı parametrlərdən istifadə etmişiksə onu probla göndərsin qarşılığında əvvəlki addPost səhifəsi açılacaq
  // Ve statusumuzu deyise bileceyik.  useffectin icinde yazmaq daha dogrudur.
  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl || "");

        setTags(data.tags.join(","));
      });
    }
  }, [id]);

  // Sekili silirsen ama upload etdikden sora yene qalirsa bu funksiyani yaz

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  //Eger localStoragede token varsa isle yoxdursa ana sehifeye yonlendir
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/ " />;
  }

  console.log({ title, tags, text });
  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputfILERef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputfILERef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Yadda saxla" : "Nəşr et"}
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
