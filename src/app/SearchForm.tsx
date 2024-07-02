"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function SearchForm({ value }: { value: string }) {
  const [prompt, setPrompt] = useState(value);
  return (
    <form>
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        type="text"
        name="q"
        placeholder="Enter a prompt"
        className="mb-5"
      />
    </form>
  );
}
