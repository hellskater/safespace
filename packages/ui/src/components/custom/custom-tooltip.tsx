import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type CustomTooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode | string;
  delay?: number;
};

const CustomTooltip = ({
  children,
  content,
  delay = 10,
}: CustomTooltipProps) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger className="cursor-pointer" asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          {typeof content === "string" ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
