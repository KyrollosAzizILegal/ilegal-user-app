import React from "react";
import Markdown from "markdown-to-jsx";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Textarea,
  ModalFooter,
  useDisclosure,
  ModalContent,
} from "@heroui/react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSummarizeTextMutation } from "@/redux/services/api";
import { isFetchBaseQueryError } from "@/redux/store";
import { useTranslations } from "next-intl";

const schema = yup.object().shape({
  text: yup
    .string()
    .required("Text is required")
    .min(10, "Text must be at least 10 characters"),
});

export const StaticComponent = () => {
  const t = useTranslations("summarization");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [summarizeText, {data, isLoading, error }] = useSummarizeTextMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await summarizeText(data.text).unwrap();
      console.log("Response Data:", response.data);

      if (!response.data || typeof response.data !== "object") {
        console.error("Invalid response.Data:", response.data);
        return;
      }

      onClose();
      reset();
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
  });

  return (
    <div className="flex-1">
      {/* Button to open modal */}
      <Button onPress={onOpen} color="primary">
        {t("static.openText")}
      </Button>

      {/* Modal */}
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4>{t("static.title")}</h4>
              </ModalHeader>
              <ModalBody>
                <form id="textForm" onSubmit={onSubmit}>
                  <Textarea
                    placeholder={t("static.text")}
                    fullWidth
                    rows={20}
                    {...register("text")}
                  />
                  {errors.text && (
                    <p style={{ color: "red" }}>{errors.text.message}</p>
                  )}
                </form>
              </ModalBody>
              {error && isFetchBaseQueryError(error) && (
                <div className="mt-4">
                  <p className="text-red-500 text-sm">
                    {error.data &&
                    typeof error.data === "object" &&
                    "message" in error.data
                      ? (error.data as { message: string }).message
                      : "An error occurred. Please try again."}
                  </p>
                </div>
              )}
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    reset();
                  }}
                >
                  {t("static.close")}
                </Button>
                {/* Button with `form` attribute */}
                <Button
                  type="submit"
                  color="primary"
                  form="textForm"
                  isLoading={isLoading}
                >
                  {t("static.submit")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Summary Output */}
      <div className="mt-5 whitespace-pre-wrap prose prose-slate max-w-none prose-ul:text-black prose-li:marker:text-black">
        {data && data.data.summary && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">Summary</h2>
            <Markdown>{data.data.summary}</Markdown>
          </>
        )}
      </div>
      <div className="mt-5 whitespace-pre-wrap prose prose-slate max-w-none prose-ul:text-black prose-li:marker:text-black">
        {data && <Markdown>{data.data.raw_response}</Markdown>}
      </div>
    </div>
  );
};
