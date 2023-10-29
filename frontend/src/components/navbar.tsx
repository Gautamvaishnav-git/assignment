import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Home, List, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

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
        <Button variant={"outline"} size={"icon"}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <LogOut onClick={logout} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </div>
    </>
  );
};

export default Navbar;
