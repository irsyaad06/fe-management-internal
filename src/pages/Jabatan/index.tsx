import { useEffect, useState } from "react";
import { MdOutlineInbox } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ActionButton from "@/components/ActionButton";
import { Jabatan } from "@/utils/interface";
import { Column } from "@/components/Table/types";
import { deleteJabatan, getJabatan } from "@/service/Jabatan";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
import Table from "@/components/Table";
import Swal from "sweetalert2";
import { formatDate } from "@/utils/FormatDate";

const JabatanPages = () => {
  const [jabatanData, setJabatanData] = useState<Jabatan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const columns: Column<Jabatan>[] = [
    { header: "No", key: "no" },
    { header: "Nama Jabatan", key: "nama" },
    {
      header: "Created At",
      key: "created_at",
      render: formatDate,
    },
    {
      header: "Updated At",
      key: "updated_at",
      render: formatDate
    },
    {
      header: "Aksi",
      key: "id",
      render: (_, row) => (
        <ActionButton
          updatePath={`/jabatan/update/${row.id}`}
          onDelete={() => handleDelete(row.id)}
        />
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getJabatan();
        setJabatanData(response.data.payload || []);
      } catch (error) {
        console.error("Error Fetching Jabatan : ", error);
        setError("Failed to fetch jabatan data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteJabatan(id);

        setJabatanData((prevData) =>
          prevData.filter((jabatan) => jabatan.id !== id)
        );

        Swal.fire({
          title: "Berhasil!",
          text: response.message,
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error deleting jabatan:", error);
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menghapus jabatan. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-400 text-center p-4">{error}</div>;
  }

  return (
    <div className="animate-slide-in p-3 space-y-10">
      <div className="flex justify-end">
        <Button
          variant="outline"
          icon={<IoAddOutline className="text-xl" />}
          iconPosition="right"
          onClick={() => navigate("create")}
        >
          Buat Jabatan
        </Button>
      </div>

      {jabatanData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-text-secondary">
          <MdOutlineInbox className="w-16 h-16 mb-4 text-dark-tertiary" />
          <p className="text-lg font-medium">Tidak ada data jabatan</p>
          <p className="text-sm mt-2">Data jabatan belum tersedia saat ini</p>
        </div>
      ) : (
        <Table data={jabatanData} columns={columns} />
      )}
    </div>
  );
};

export default JabatanPages;
