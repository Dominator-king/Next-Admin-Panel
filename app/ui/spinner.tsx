export function Spinner() {
  return (
    <div className=" absolute right-0 top-0 z-20 flex h-full w-full items-center justify-center bg-blue-500 bg-opacity-10 ">
      <div className="animate-spin-slow h-16 w-16 rounded-full border-t-4 border-solid border-blue-500"></div>
    </div>
  );
}
