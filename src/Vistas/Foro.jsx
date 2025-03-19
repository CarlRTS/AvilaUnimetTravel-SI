import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const Foro = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");


  //Revisa si el usuario esta registrado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Publicaciones
  const addPost = async (title, content) => {
    if (!title || !content) return;
    try {
      await addDoc(collection(db, "publicaciones"), {
        title,
        content,
        timestamp: new Date(),
        author: user.email,
      });
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // actualiza las publicaciones en tiempo real
  useEffect(() => {
    const q = query(collection(db, "publicaciones"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Comment Functions
  const addComment = async (postId, comment) => {
    if (!comment) return;
    try {
      await addDoc(collection(db, "publicaciones", postId, "comentarios"), {
        text: comment,
        timestamp: new Date(),
        author: user.email,
      });
      setComment("");
    } catch (error) {
      console.error("Error agregando comentarios:", error);
    }
  };

  return (
    <div style={styles.container}>
      {/* secciono de verificacion de usuario */}
      {!user ? (
        <div style={styles.authContainer}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="contraseña"
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={() => login(email, password)} style={styles.button}>
            Iniciar Sesion
          </button>
          <button onClick={() => signUp(email, password)} style={styles.button}>
            Registrarse
          </button>
        </div>
      ) : (
        <div style={styles.authContainer}>
          <p>Bienvenido, {user.email}</p>
          <button onClick={logout} style={styles.button}>
            Terminar Sesion
          </button>
        </div>
      )}

      {/* Seccion de publicacion*/}
      {user && (
        <div style={styles.postForm}>
          <h3>Publicar</h3>
          <input
            type="contenido"
            placeholder="titulo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          />
          <button onClick={() => addPost(title, content)} style={styles.button}>
            Agregar Publicacion
          </button>
        </div>
      )}

      {/* Publicaciones */}
      <div style={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post.id} style={styles.post}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>Por: {post.author}</small>

            {/* Comentarios*/}
            <div style={styles.commentsContainer}>
              <h4>Comentarios</h4>
              {user && (
                <div>
                  <input
                    type="contenido"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={styles.input}
                  />
                  <button
                    onClick={() => addComment(post.id, comment)}
                    style={styles.button}
                  >
                    Comentar
                  </button>
                </div>
              )}
              {/* Render */}
              {post.comments &&
                post.comments.map((comment, index) => (
                  <div key={index} style={styles.comment}>
                    <p>{comment.text}</p>
                    <small>Por: {comment.author}</small>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default Foro;