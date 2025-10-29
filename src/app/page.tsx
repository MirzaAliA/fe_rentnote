import Image from "next/image";

export default function Home() {
  return (
    <div className="bio flex flex-row gap-4 justify-between pl-96 pr-96">
      <div className="name">Mirza</div>
      <div className="age">23</div>
      <div className="address">Sumurboto</div>
    </div>
  );
}
