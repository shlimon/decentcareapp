import DocumentViewer from '@components/reusable/DocumentViewer';
import { formatDate } from '@utils/DateFormation';

const WHSDetails = ({ whs }) => {
  return (
    <div className="space-y-6">
      <Section title="Basic Information">
        <Detail label="WHS Number" value={whs.whsNumber} />
        <Detail label="Event Type" value={whs.eventType} />
        <Detail label="Event Date" value={formatDate(whs.eventDate)} />
        <Detail label="Event Time" value={whs.eventTime} />
        <Detail label="Status" value={whs.status} />
      </Section>

      <Section title="Location">
        <Detail label="Full Address" value={whs.location?.fullAddress} />
        <Detail label="City" value={whs.location?.city} />
        <Detail label="State" value={whs.location?.state} />
        <Detail label="Post Code" value={whs.location?.postCode} />
        <Detail label="Country" value={whs.location?.country} />
      </Section>

      <Section title="Incident Details">
        <Detail label="Lead Up" value={whs.leadUp} />
        <Detail label="What Happened" value={whs.whatHappened} />
        <Detail label="Injury Nature" value={whs.injuryNature} />
        <Detail label="Summary" value={whs.summary} />
      </Section>

      <Section title="Witness & Evidence">
        <Detail label="Has Witness" value={whs.hasWitness ? 'Yes' : 'No'} />
        {whs.hasWitness && (
          <Detail label="Witness Details" value={whs.witnessDetails} />
        )}

        <Detail label="Has Evidence" value={whs.hasEvidence ? 'Yes' : 'No'} />

        {whs.evidenceFiles?.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Evidence Files</p>
            <ul className="list-disc list-inside space-y-1">
              {whs.evidenceFiles.map((file, index) => (
                <div key={index}>
                  <DocumentViewer
                    document={{ documentUrl: file }}
                    modalViews={['jpg', 'jpeg', 'png', 'pdf', 'webp']}
                  />
                </div>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Treatment & Return To Work">
        <Detail
          label="Treatment Provided"
          value={whs.treatmentProvided ? 'Yes' : 'No'}
        />
        {whs.treatmentProvided && (
          <Detail label="Treatment Details" value={whs.treatmentDetails} />
        )}

        <Detail
          label="Returned To Work"
          value={whs.returnedToWork ? 'Yes' : 'No'}
        />
        {whs.returnedToWork && (
          <Detail label="Return Details" value={whs.returnToWorkDetails} />
        )}
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium break-words">{value || '-'}</p>
  </div>
);

export default WHSDetails;
