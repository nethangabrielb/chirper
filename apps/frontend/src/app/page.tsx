import { FormButton } from "@/components/button";
import Icon from "@/components/icon";

const LandingPage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-svh justify-center lg:justify-evenly items-center px-6 py-12 lg:px-0 lg:py-0">
      <div className="hidden lg:flex flex-1 justify-center">
        <Icon width={450} height={450} alt="Twitter Icon"></Icon>
      </div>

      <div className="flex flex-col items-center lg:items-start gap-10 w-full lg:flex-1">
        <div className="flex flex-col items-center lg:items-start gap-10 w-full max-w-[350px] lg:max-w-none mx-auto lg:mx-0">
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-7xl tracking-tighter rotate-x-[35deg] text-center lg:text-left">
            Happening now
          </h1>
          <div className="flex flex-col w-full max-w-[300px] gap-4">
            <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tighter rotate-x-[35deg] text-center lg:text-left">
              Join today.
            </h3>
            <FormButton
              icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
              outline={false}
              type="google"
              className="p-[10px] bg-white text-neutral-700 font-medium"
            >
              Sign up with Google
            </FormButton>
            <div className="flex items-center gap-2">
              <div className="h-[1px] bg-border flex-1"></div>
              <p className="w-fit">OR</p>
              <div className="h-[1px] bg-border flex-1"></div>
            </div>
            <FormButton
              outline={false}
              type="register"
              className="p-[10px] font-bold"
            >
              Create an account
            </FormButton>
            <FormButton
              outline={true}
              type="guest"
              className="p-[10px] font-bold"
            >
              Sign in as Guest
            </FormButton>
            <p className="text-[10px] font-medium text-muted-foreground tracking-wide">
              By signing up, you agree to the{" "}
              <span className="text-primary">Terms of Service</span> and{" "}
              <span className="text-primary">Privacy Policy</span>, including{" "}
              <span className="text-primary">Cookie Use</span>. <br></br>
              <br></br>
              <p className="text-center mt-2">
                Made with 💙 by nethangabrielb{" "}
              </p>
              <button className="mt-1 cursor-none select-none pointer-events-none w-full">
                <a
                  href="https://github.com/nethangabrielb"
                  rel="noopener"
                  target="_blank"
                  className="!cursor-pointer !pointer-events-auto"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-[24px] inline fill-white"
                  >
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </button>
            </p>
            <h4 className="font-semibold mt-10">Already have an account?</h4>
            <FormButton outline={true} type="login" className="p-[10px]">
              Sign in
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
