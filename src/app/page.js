import BookFloatingGrid from "@/components/BookFloatingGrid";

export default function Home() {
  const books = [
    { title: "Book 1", cover: "/book1.png" },
    { title: "Book 2", cover: "/book2.png" },
    { title: "Book 3", cover: "/book3.png" },
    { title: "Book 4", cover: "/book4.png" },
    { title: "Book 5", cover: "/book5.png" },
    { title: "Book 6", cover: "/book6.png" },
  ];

  return <BookFloatingGrid books={books} />;
}
