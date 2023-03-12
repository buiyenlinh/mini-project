import { Contact } from "./steps/contact";
import { Information } from "./steps/information";

export const CreateOrUpdateForm = () => {
  return (
    <div className="w-[500px] h-[50vh] overflow-auto pr-2">
      <Information />
      <Contact />
    </div>
  );
};
