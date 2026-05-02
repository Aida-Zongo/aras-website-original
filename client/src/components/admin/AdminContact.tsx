import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminContact() {
  const { data: submissions, refetch } = trpc.contact.list.useQuery();

  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Statut mis à jour");
      refetch();
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: COLORS.aras.green }}>
        Messages de Contact
      </h2>

      <div className="space-y-4">
        {submissions?.map((submission) => (
          <Card key={submission.id} className="p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <h3 className="font-bold">{submission.subject}</h3>
                <p className="text-sm text-gray-600">
                  De : {submission.name} ({submission.email})
                </p>
                <p className="text-sm mt-3 text-gray-700">{submission.message}</p>
              </div>

              <div className="flex flex-col gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded w-fit ${
                    submission.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : submission.status === "read"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {submission.status === "new"
                    ? "Nouveau"
                    : submission.status === "read"
                      ? "Lu"
                      : "Répondu"}
                </span>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: submission.id,
                        status: "read",
                      })
                    }
                  >
                    Marquer comme lu
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: submission.id,
                        status: "responded",
                      })
                    }
                  >
                    Répondu
                  </Button>
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-center"
                  >
                    <Button size="sm" variant="outline" className="w-full">
                      Répondre par email
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
