import DocumentPage from "@components/chat/DocumentPage";
import NavigateButton from "@components/ui/NavigateButton";
import { ArrowLeft } from "lucide-react";

function EmployeeHandbook() {
    return (
        <>
            <div className="p-4">

                {/* Section Header */}
                <div className="px-4 py-4 mb-6 bg-gray-200 border border-gray-300 rounded-2xl">
                    <h2 className="text-base font-medium text-gray-800">
                        Employee Handbook
                    </h2>
                </div>
                <NavigateButton
                    navigateUrl="/resource"
                    title="Back to resources"
                    icon={ArrowLeft}
                    iconPosition="left"
                />
                <DocumentPage
                    title="Employee Handbooks"
                    type="handbook"
                />
            </div>
        </>

    );
}

export default EmployeeHandbook;
