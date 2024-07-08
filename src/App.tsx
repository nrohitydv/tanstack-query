import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const POSTS = [
  { id: 1, title: "post1" },
  { id: 2, title: "post2" },
];
const App = () => {
  const queryClient = useQueryClient();

  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS]),
  });
  const createPost = useMutation({
    mutationFn: (title: string) => {
      return wait(1000).then(() => POSTS.push({ id: Date.now(), title }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
  if (postQuery.isLoading) return <div>Loading...</div>;
  if (postQuery.isError) return <pre>{JSON.stringify(postQuery.error)}</pre>;
  return (
    <div>
      {postQuery.data?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button
        disabled={createPost.isPending}
        onClick={() => createPost.mutate("new post")}
      >
        Create Post
      </button>
    </div>
  );
};

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
