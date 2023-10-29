import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Home, List } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <>
      <div className="flex items-center justify-around sticky top-6 mx-auto p-2 w-1/3 border rounded-full">
        <Button variant={"outline"} size={"icon"}>
          <Link to="/">
            <Home />
          </Link>
        </Button>
        <Button variant={"outline"} size={"icon"}>
          <Link to="/lists">
            <List />
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </>
  );
};

export default Navbar;
