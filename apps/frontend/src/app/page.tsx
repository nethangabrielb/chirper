import { FormButton } from "@/components/button";
import Icon from "@/components/icon";

const LandingPage = () => {
  return (
    <div className="flex gap-4 h-svh justify-evenly items-center">
      <div className="flex-1 flex justify-center">
        <Icon width={450} height={450} alt="Twitter Icon"></Icon>
      </div>

      <div className="flex flex-col items-center gap-10 flex-1">
        <div className="flex flex-col items-start gap-10">
          <h1 className="font-extrabold text-7xl tracking-tighter rotate-x-[35deg]">
            Happening now
          </h1>
          <div className="flex flex-col w-[300px] gap-4">
            <h3 className="font-bold text-4xl tracking-tighter rotate-x-[35deg]">
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
