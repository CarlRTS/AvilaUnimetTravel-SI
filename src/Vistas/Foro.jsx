import { useState, useEffect } from "react";
import { db } from "../Firebase/FireBase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import Header from "./components/header";

export default function Foro() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentImageUrls, setCommentImageUrls] = useState({});
  const [showComments, setShowComments] = useState({});
  const [error, setError] = useState("");

  const isValidImage = (url) => {
    if (!url) return true;
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|bmp|svg)(\?.*)?$/i;
    return allowedExtensions.test(url);
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const addPost = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!title || !content || !currentUser) return;
    
    if (postImageUrl && !isValidImage(postImageUrl)) {
      setError("Formato de imagen no válido para la publicación");
      return;
    }

    try {
      await addDoc(collection(db, "publicaciones"), {
        title,
        content,
        imageUrl: postImageUrl || null,
        timestamp: new Date(),
        author: currentUser.email
      });
      setTitle("");
      setContent("");
      setPostImageUrl("");
    } catch (error) {
      console.error("Error publicando:", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "publicaciones"), orderBy("timestamp", "desc"));
    const unsubscribePosts = onSnapshot(q, async (snapshot) => {
      const postsData = await Promise.all(
        snapshot.docs.map(async doc => {
          const commentsQuery = query(
            collection(db, "publicaciones", doc.id, "comentarios"), 
            orderBy("timestamp", "asc")
          );
          
          const unsubscribeComments = onSnapshot(commentsQuery, (commentsSnapshot) => {
            setPosts(prevPosts => prevPosts.map(post => {
              if (post.id === doc.id) {
                return {
                  ...post,
                  comments: commentsSnapshot.docs.map(commentDoc => ({
                    id: commentDoc.id,
                    text: commentDoc.data().text,
                    imageUrl: commentDoc.data().imageUrl || null,
                    timestamp: commentDoc.data().timestamp?.toDate(),
                    author: commentDoc.data().author
                  }))
                };
              }
              return post;
            }));
          });

          return {
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content,
            imageUrl: doc.data().imageUrl || null,
            timestamp: doc.data().timestamp?.toDate(),
            author: doc.data().author,
            unsubscribeComments
          };
        })
      );

      setPosts(postsData);

      return () => {
        postsData.forEach(post => post.unsubscribeComments?.());
      };
    });

    return () => unsubscribePosts();
  }, []);

  const addComment = async (postId) => {
    setError("");
    const commentText = comments[postId];
    const commentImage = commentImageUrls[postId] || "";
    
    if (!commentText || !currentUser) return;
    
    if (commentImage && !isValidImage(commentImage)) {
      setError("Formato de imagen no válido para el comentario");
      return;
    }

    try {
      await addDoc(collection(db, "publicaciones", postId, "comentarios"), {
        text: commentText,
        imageUrl: commentImage || null,
        timestamp: new Date(),
        author: currentUser.email
      });
      setComments(prev => ({ ...prev, [postId]: '' }));
      setCommentImageUrls(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error("Error comentando:", error);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#feae4b' }}>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-160px)] overflow-y-auto">
        {currentUser && (
          <form onSubmit={addPost} className="mb-8 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Nueva Publicación
            </h2>
            <input
              type="text"
              placeholder="Título de tu publicación"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <textarea
              placeholder="Escribe tu contenido aquí..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <input
              type="url"
              placeholder="URL de imagen para la publicación (opcional)"
              value={postImageUrl}
              onChange={(e) => setPostImageUrl(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors hover:shadow-lg"
            >
              Publicar 🚀
            </button>
          </form>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                {post.imageUrl && (
                  <div className="my-4 overflow-hidden rounded-lg border-2 border-gray-100">
                    <img 
                      src={post.imageUrl} 
                      alt="Contenido visual de la publicación"
                      className="w-full max-h-64 object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="mr-2">👤 {post.author}</span>
                  <span className="mr-2">•</span>
                  <span>📅 {post.timestamp?.toLocaleDateString()}</span>
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="ml-4 text-purple-600 hover:text-purple-700"
                  >
                    {showComments[post.id] ? 'Ocultar comentarios' : 'Ver comentarios'}
                  </button>
                </div>
              </div>

              {showComments[post.id] && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-700 mb-4">💬 Comentarios</h4>
                  {currentUser && (
                    <div className="mb-6 flex flex-col gap-4">
                      <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        value={comments[post.id] || ''}
                        onChange={(e) => setComments(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        className="flex-1 p-2 border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none"
                      />
                      <input
                        type="url"
                        placeholder="URL de imagen para el comentario (opcional)"
                        value={commentImageUrls[post.id] || ''}
                        onChange={(e) => setCommentImageUrls(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        className="flex-1 p-2 border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none"
                      />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <button
                        onClick={() => addComment(post.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors self-end"
                      >
                        Comentar
                      </button>
                    </div>
                  )}
                  <div className="space-y-4">
                    {post.comments?.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{comment.text}</p>
                        {comment.imageUrl && (
                          <div className="mt-2 overflow-hidden rounded-lg border-2 border-gray-100">
                            <img 
                              src={comment.imageUrl} 
                              alt="Contenido visual del comentario"
                              className="w-full max-h-48 object-cover"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                        <div className="mt-2 text-sm text-gray-500">
                          <span>👤 {comment.author}</span>
                          <span className="mx-2">•</span>
                          <span>📅 {comment.timestamp?.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}