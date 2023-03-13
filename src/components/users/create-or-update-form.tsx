import { Contact } from "./steps/contact";
import { Information } from "./steps/information";
import { Work } from "./steps/work";

export const CreateOrUpdateForm = ({ userId }: { userId?: string }) => {
  return (
    <div className="w-[500px] h-[50vh] overflow-auto pr-2">
      <Information />
      <Contact userId={userId} />
      <Work />
    </div>
  );
};
