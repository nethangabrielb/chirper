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
              <span className="text-primary">Cookie Use</span>.
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
