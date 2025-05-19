import BookFloatingGrid from "@/components/BookFloatingGrid";

export default function Home() {
  const books = [
    { title: "Book 1", cover: "/file.svg" },
    { title: "Book 2", cover: "/file.svg" },
    { title: "Book 3", cover: "/file.svg" },
    { title: "Book 4", cover: "/file.svg" },
    { title: "Book 5", cover: "/file.svg" },
    { title: "Book 6", cover: "/file.svg" },
  ];

  return <BookFloatingGrid books={books} />;
}
