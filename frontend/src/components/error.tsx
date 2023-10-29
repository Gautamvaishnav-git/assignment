import { AxiosError } from "axios";
import { Button } from "./ui/button";

const ErrorComponent = ({
  error,
  fallbackError = "something went wrong",
  retry,
}: {
  error: unknown;
  fallbackError: string;
  retry?: () => void;
}) => {
  console.log(error);
  if (error instanceof AxiosError) {
    if (error.code === "ERR_NETWORK") {
      return (
        <div>
          <h1>Network Error</h1>
          <p>Check your internet connection</p>
          {retry && <Button onClick={retry}>Retry</Button>}
        </div>
      );
    } else {
      return (
        <div>
          {error.response?.data.message ?? "something went wrong"}
          {retry && <Button onClick={retry}>Retry</Button>}
        </div>
      );
    }
  }

  if (error instanceof Error) {
    return (
      <div>
        {error.message}
        {retry && <Button onClick={retry}>Retry</Button>}
      </div>
    );
  }
  return (
    <div>
      {fallbackError}
      {retry && <Button onClick={retry}>Retry</Button>}
    </div>
  );
};

export default ErrorComponent;
