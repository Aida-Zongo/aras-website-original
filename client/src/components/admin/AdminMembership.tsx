import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COLORS, MEMBERSHIP_TYPES } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminMembership() {
  const { data: submissions, refetch } = trpc.membership.list.useQuery();

  const updateStatusMutation = trpc.membership.updateStatus.useMutation({
    onSuccess: (data, variables) => {
      toast.success("Statut mis à jour. Ouverture de la messagerie...");

      // Find the submission to get details for the email
      const submission = submissions?.find(s => s.id === variables.id);
      if (submission && (variables.status === 'approved' || variables.status === 'rejected')) {
        openEmailClient(submission, variables.status);
      }

      refetch();
    },
    onError: (err) => {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  });

  const openEmailClient = (submission: any, status: "approved" | "rejected") => {
    const contactEmail = "source_kdg@live.fr";
    let subject = "";
    let body = "";

    if (status === "approved") {
      subject = "🎉 Adhésion ARAS - Approuvée";
      body = `Bonjour ${submission.firstName},\n\nVotre demande d'adhésion à ARAS a été approuvée !\n\nBienvenue parmi nous.\n\nCordialement,\nL'équipe ARAS`;
    } else {
      subject = "Adhésion ARAS - Mise à jour";
      body = `Bonjour ${submission.firstName},\n\nVotre demande d'adhésion à ARAS n'a pas pu être retenue pour le moment.\n\nPour toute information supplémentaire, vous pouvez nous contacter sur :\n${contactEmail}\n\nCordialement,\nL'équipe ARAS`;
    }

    const mailtoLink = `mailto:${submission.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: COLORS.aras.green }}>
        Demandes d'Adhésion
      </h2>

      <div className="space-y-4">
        {submissions && submissions.length > 0 ? (
          submissions.map((submission) => (
            <Card key={submission.id} className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold">
                    {submission.firstName} {submission.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{submission.email}</p>
                  {submission.phone && (
                    <p className="text-sm text-gray-600">{submission.phone}</p>
                  )}
                  <p className="text-sm mt-2">
                    <strong>Type :</strong>{" "}
                    {MEMBERSHIP_TYPES.find((t) => t.value === submission.membershipType)?.label}
                  </p>
                  {submission.motivation && (
                    <p className="text-sm mt-2">
                      <strong>Motivation :</strong> {submission.motivation}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded w-fit ${submission.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : submission.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {submission.status === "pending"
                      ? "En attente"
                      : submission.status === "approved"
                        ? "Approuvée"
                        : "Rejetée"}
                  </span>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={updateStatusMutation.isPending}
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: submission.id,
                          status: "approved",
                        })
                      }
                    >
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={updateStatusMutation.isPending}
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: submission.id,
                          status: "rejected",
                        })
                      }
                    >
                      Rejeter
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-gray-500">
            Aucune demande d'adhésion pour le moment.
          </Card>
        )}
      </div>
    </div>
  );
}
