import {
  ArrowRight,
  Save,
  Trash2,
  Mail,
  User,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  Button,
  Input,
  Card,
  Spinner,
  Badge,
  Modal,
  Select,
  Textarea,
  LoadingScreen,
  ConfirmModal,
} from "./components/ui";
import { useState } from "react";
const TestUI = () => {
  const [openModal, setOpenModal] = useState(null);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleConfirm = async () => {
    setConfirmLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setConfirmLoading(false);
  };
  return (
    <div>
      {/* ============Button UI Demo============ */}
      <div className="p-6 space-y-6 bg-gray-50 ">
        <h1 className="text-2xl font-bold">Button UI Demo</h1>

        {/* Variants */}
        <section>
          <h2 className="font-semibold mb-3">Variants</h2>
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h2 className="font-semibold mb-3">Sizes</h2>
          <div className="flex gap-3 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="font-semibold mb-3">Icons</h2>
          <div className="flex gap-3 flex-wrap">
            <Button leftIcon={<Save size={18} />}>Save</Button>
            <Button variant="outline" rightIcon={<ArrowRight size={18} />}>
              Continue
            </Button>
            <Button variant="danger" leftIcon={<Trash2 size={18} />}>
              Delete
            </Button>
          </div>
        </section>

        {/* Loading */}
        <section>
          <h2 className="font-semibold mb-3">Loading</h2>
          <div className="flex gap-3">
            <Button loading>Loading...</Button>
            <Button variant="outline" loading>
              Please wait
            </Button>
          </div>
        </section>

        {/* Disabled */}
        <section>
          <h2 className="font-semibold mb-3">Disabled</h2>
          <div className="flex gap-3">
            <Button disabled>Disabled</Button>
            <Button variant="danger" disabled>
              Disabled Danger
            </Button>
          </div>
        </section>

        {/* Full width */}
        <section>
          <h2 className="font-semibold mb-3">Full Width</h2>
          <div className="max-w-md space-y-3">
            <Button fullWidth>Full Width Button</Button>
            <Button variant="outline" fullWidth>
              Full Width Outline
            </Button>
          </div>
        </section>
      </div>
      {/* ============Input UI Demo============ */}
      <div className=" bg-gray-50 p-6 space-y-8">
        <h1 className="text-2xl font-bold">Input UI Demo</h1>

        {/* Basic */}
        <section className="space-y-4 max-w-md">
          <h2 className="font-semibold">Basic</h2>
          <Input label="Họ và tên" placeholder="Nhập họ tên" />
          <Input label="Email" placeholder="example@gmail.com" />
        </section>

        {/* With icons */}
        <section className="space-y-4 max-w-md">
          <h2 className="font-semibold">Icons</h2>
          <Input
            label="Email"
            placeholder="example@gmail.com"
            leftIcon={<Mail size={18} />}
          />
          <Input
            label="Tên người dùng"
            placeholder="username"
            leftIcon={<User size={18} />}
            rightIcon={<Search size={18} />}
          />
        </section>

        {/* Password */}
        <section className="space-y-4 max-w-md">
          <h2 className="font-semibold">Password</h2>
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            helperText="Ít nhất 8 ký tự"
          />
        </section>

        {/* Error */}
        <section className="space-y-4 max-w-md">
          <h2 className="font-semibold">Error</h2>
          <Input
            label="Email"
            placeholder="example@gmail.com"
            error="Email không hợp lệ"
          />
        </section>

        {/* Disabled */}
        <section className="space-y-4 max-w-md">
          <h2 className="font-semibold">Disabled</h2>
          <Input label="Tài khoản" placeholder="Không thể nhập" disabled />
        </section>

        {/* Helper text */}
        <section className="space-y-4 max-w-md">
          <h2 className="font-semibold">Helper text</h2>
          <Input
            label="Số điện thoại"
            placeholder="0123456789"
            helperText="Chỉ nhập số"
          />
        </section>

        {/* Full width */}
        <section className="space-y-4">
          <h2 className="font-semibold">Full width</h2>
          <Input label="Địa chỉ" placeholder="Nhập địa chỉ" fullWidth />
        </section>
      </div>
      {/* ============Card UI Demo============ */}
      <div className=" bg-gray-50 p-6 space-y-8">
        <h1 className="text-2xl font-bold">Card UI Demo</h1>

        {/* Basic Card */}
        <section className="max-w-md">
          <Card>
            <Card.Content>
              <p className="text-char-700">
                Đây là Card cơ bản, chỉ có content.
              </p>
            </Card.Content>
          </Card>
        </section>

        {/* Card with Header */}
        <section className="max-w-md">
          <Card>
            <Card.Header>
              <Card.Title>Thông tin người dùng</Card.Title>
            </Card.Header>

            <Card.Content>
              <p className="text-char-700">
                Tên: Nguyễn Văn A <br />
                Email: example@gmail.com
              </p>
            </Card.Content>
          </Card>
        </section>

        {/* Card with Footer */}
        <section className="max-w-md">
          <Card>
            <Card.Header>
              <Card.Title>Xác nhận</Card.Title>
            </Card.Header>

            <Card.Content>
              <p className="text-char-700">
                Bạn có chắc chắn muốn thực hiện hành động này không?
              </p>
            </Card.Content>

            <Card.Footer className="flex justify-end gap-2">
              <Button variant="ghost">Hủy</Button>
              <Button variant="danger">Xóa</Button>
            </Card.Footer>
          </Card>
        </section>

        {/* Padding variants */}
        <section>
          <h2 className="font-semibold mb-3">Padding variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="sm">
              <Card.Content>Padding nhỏ</Card.Content>
            </Card>

            <Card padding="md">
              <Card.Content>Padding vừa</Card.Content>
            </Card>

            <Card padding="lg">
              <Card.Content>Padding lớn</Card.Content>
            </Card>
          </div>
        </section>

        {/* Custom class */}
        <section className="max-w-md">
          <Card className="bg-beige-50 border-primary-300">
            <Card.Header>
              <Card.Title>Custom style</Card.Title>
            </Card.Header>
            <Card.Content>Card này có className custom.</Card.Content>
          </Card>
        </section>
      </div>
      {/* ============Spinner UI Demo============ */}
      <div className=" bg-gray-50 p-6 space-y-8">
        <h1 className="text-2xl font-bold">Spinner UI Demo</h1>

        {/* Sizes */}
        <section>
          <h2 className="font-semibold mb-4">Sizes</h2>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm">sm</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <span className="text-sm">md</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <span className="text-sm">lg</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="xl" />
              <span className="text-sm">xl</span>
            </div>
          </div>
        </section>

        {/* Inline loading */}
        <section>
          <h2 className="font-semibold mb-4">Inline loading</h2>
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <span>Đang tải dữ liệu...</span>
          </div>
        </section>

        {/* Centered loading */}
        <section>
          <h2 className="font-semibold mb-4">Centered loading</h2>
          <div className="flex items-center justify-center h-40 bg-white rounded-xl border">
            <Spinner size="lg" />
          </div>
        </section>

        {/* Button loading */}
        <section>
          <h2 className="font-semibold mb-4">Button loading</h2>
          <div className="flex gap-3">
            <Button loading>Đang gửi</Button>
            <Button variant="outline" loading>
              Đang xử lý
            </Button>
          </div>
        </section>

        {/* Custom color & size */}
        <section>
          <h2 className="font-semibold mb-4">Custom</h2>
          <Spinner size="xl" className="text-red-500" />
        </section>
      </div>
      {/* ============Badge UI Demo============ */}
      <div className=" bg-gray-50 p-6 space-y-8">
        <h1 className="text-2xl font-bold">Badge UI Demo</h1>

        {/* Variants */}
        <section>
          <h2 className="font-semibold mb-4">Variants</h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h2 className="font-semibold mb-4">Sizes</h2>
          <div className="flex items-center gap-3">
            <Badge size="xs">XS</Badge>
            <Badge size="sm">SM</Badge>
            <Badge size="md">MD</Badge>
          </div>
        </section>

        {/* With icon */}
        <section>
          <h2 className="font-semibold mb-4">With icon</h2>
          <div className="flex gap-3">
            <Badge variant="success">
              <CheckCircle size={14} className="mr-1" />
              Hoạt động
            </Badge>
            <Badge variant="warning">
              <AlertTriangle size={14} className="mr-1" />
              Cảnh báo
            </Badge>
            <Badge variant="info">
              <Info size={14} className="mr-1" />
              Thông tin
            </Badge>
          </div>
        </section>

        {/* In real UI */}
        <section>
          <h2 className="font-semibold mb-4">Real use cases</h2>

          <div className="space-y-3 max-w-md">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
              <span>Đơn hàng #12345</span>
              <Badge variant="success">Đã giao</Badge>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
              <span>Thanh toán</span>
              <Badge variant="warning">Chờ xử lý</Badge>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
              <span>Tài khoản</span>
              <Badge variant="danger">Bị khóa</Badge>
            </div>
          </div>
        </section>

        {/* Custom */}
        <section>
          <h2 className="font-semibold mb-4">Custom style</h2>
          <Badge className="bg-purple-100 text-purple-700">Custom Badge</Badge>
        </section>
      </div>
      {/* ============Modal UI Demo============ */}
      <div className=" bg-gray-50 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Modal UI Demo</h1>

        {/* Open buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setOpenModal("sm")}>Open Small</Button>
          <Button onClick={() => setOpenModal("md")}>Open Medium</Button>
          <Button onClick={() => setOpenModal("lg")}>Open Large</Button>
          <Button onClick={() => setOpenModal("xl")}>Open XLarge</Button>
          <Button variant="outline" onClick={() => setOpenModal("full")}>
            Open Full
          </Button>
        </div>

        {/* Small */}
        <Modal
          isOpen={openModal === "sm"}
          onClose={() => setOpenModal(null)}
          title="Modal nhỏ"
          size="sm">
          <p className="text-char-700">
            Đây là modal size nhỏ. Nhấn ESC hoặc click overlay để đóng.
          </p>
        </Modal>

        {/* Medium (Form example) */}
        <Modal
          isOpen={openModal === "md"}
          onClose={() => setOpenModal(null)}
          title="Đăng nhập"
          size="md">
          <div className="space-y-4">
            <Input label="Email" placeholder="example@gmail.com" />
            <Input label="Mật khẩu" type="password" />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpenModal(null)}>
                Hủy
              </Button>
              <Button>Đăng nhập</Button>
            </div>
          </div>
        </Modal>

        {/* Large */}
        <Modal
          isOpen={openModal === "lg"}
          onClose={() => setOpenModal(null)}
          title="Thông tin chi tiết"
          size="lg">
          <p className="text-char-700">
            Modal lớn dùng cho nội dung dài, mô tả sản phẩm, thông tin chi tiết,
            preview AR / 3D model…
          </p>
          <p className="mt-4 text-char-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            malesuada, nisl eget.
          </p>
        </Modal>

        {/* Extra large */}
        <Modal
          isOpen={openModal === "xl"}
          onClose={() => setOpenModal(null)}
          title="Bảng dữ liệu"
          size="xl">
          <div className="space-y-2">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="p-3 bg-beige-50 rounded-lg border">
                Dòng dữ liệu #{i + 1}
              </div>
            ))}
          </div>
        </Modal>

        {/* Full width */}
        <Modal
          isOpen={openModal === "full"}
          onClose={() => setOpenModal(null)}
          title="Toàn màn hình"
          size="full"
          closeOnOverlay={false}>
          <p className="text-char-700">
            Modal full width. Click overlay sẽ không đóng.
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setOpenModal(null)}>Đóng</Button>
          </div>
        </Modal>
      </div>
      {/* ============Confirm Modal UI Demo=========== */}
      <div className=" bg-gray-50 p-6 space-y-6">
        <h1 className="text-2xl font-bold">ConfirmModal UI Demo</h1>

        {/* Open buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="danger"
            onClick={() => setOpenConfirmModal("danger")}>
            Delete (Danger)
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpenConfirmModal("warning")}>
            Warning
          </Button>
          <Button variant="primary" onClick={() => setOpenConfirmModal("info")}>
            Info
          </Button>
        </div>

        {/* Danger */}
        <ConfirmModal
          isOpen={openConfirmModal === "danger"}
          onClose={() => setOpenConfirmModal(null)}
          onConfirm={handleConfirm}
          title="Xóa sản phẩm"
          message="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
          variant="danger"
          loading={confirmLoading}
        />

        {/* Warning */}
        <ConfirmModal
          isOpen={openConfirmModal === "warning"}
          onClose={() => setOpenConfirmModal(null)}
          onConfirm={handleConfirm}
          title="Cảnh báo"
          message="Bạn sắp thực hiện một hành động quan trọng. Bạn có muốn tiếp tục?"
          confirmText="Tiếp tục"
          cancelText="Quay lại"
          variant="warning"
          loading={confirmLoading}
        />

        {/* Info */}
        <ConfirmModal
          isOpen={openConfirmModal === "info"}
          onClose={() => setOpenConfirmModal(null)}
          onConfirm={handleConfirm}
          title="Xác nhận"
          message="Bạn có chắc chắn muốn lưu thay đổi?"
          confirmText="Đồng ý"
          cancelText="Hủy"
          variant="info"
          loading={confirmLoading}
        />
      </div>
      {/* ============Select UI Demo============ */}
      <div className=" bg-gray-50 p-6 space-y-8">
        <h1 className="text-2xl font-bold">Select UI Demo</h1>

        {/* Basic */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">Basic</h2>
          <Select
            label="Danh mục"
            placeholder="Chọn danh mục"
            options={[
              { value: "chair", label: "Ghế" },
              { value: "table", label: "Bàn" },
              { value: "sofa", label: "Sofa" },
              { value: "bed", label: "Giường" },
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </section>

        {/* With value */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">With value</h2>
          <Select
            label="Trạng thái đơn hàng"
            placeholder="Chọn trạng thái"
            options={[
              { value: "pending", label: "Chờ xử lý" },
              { value: "shipping", label: "Đang giao" },
              { value: "done", label: "Hoàn thành" },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          {status && (
            <p className="text-sm text-char-600">
              Giá trị đã chọn: <b>{status}</b>
            </p>
          )}
        </section>

        {/* Error */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">Error</h2>
          <Select
            label="Danh mục"
            placeholder="Chọn danh mục"
            options={[
              { value: "chair", label: "Ghế" },
              { value: "table", label: "Bàn" },
            ]}
            error="Vui lòng chọn danh mục"
          />
        </section>

        {/* Disabled */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">Disabled</h2>
          <Select
            label="Loại sản phẩm"
            placeholder="Không thể chọn"
            options={[
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
            ]}
            disabled
          />
        </section>

        {/* Full width */}
        <section className="space-y-4">
          <h2 className="font-semibold">Full width</h2>
          <Select
            label="Kho hàng"
            placeholder="Chọn kho"
            options={[
              { value: "hn", label: "Hà Nội" },
              { value: "hcm", label: "Hồ Chí Minh" },
              { value: "dn", label: "Đà Nẵng" },
            ]}
            fullWidth
          />
        </section>
      </div>
      {/* ============Textarea UI Demo============ */}
      <div className=" bg-gray-50 p-6 space-y-8">
        <h1 className="text-2xl font-bold">Textarea UI Demo</h1>

        {/* Basic */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">Basic</h2>
          <Textarea label="Mô tả" placeholder="Nhập mô tả..." />
        </section>

        {/* Controlled */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">Controlled</h2>
          <Textarea
            label="Mô tả sản phẩm"
            placeholder="Nhập mô tả sản phẩm"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            helperText={`${desc.length} ký tự`}
          />
        </section>

        {/* Rows */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">Rows</h2>
          <Textarea label="Rows = 2" rows={2} placeholder="Textarea 2 dòng" />
          <Textarea label="Rows = 6" rows={6} placeholder="Textarea 6 dòng" />
        </section>

        {/* Error */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">Error</h2>
          <Textarea
            label="Nội dung"
            placeholder="Bắt buộc nhập"
            error="Nội dung không được để trống"
          />
        </section>

        {/* Disabled */}
        <section className="max-w-md space-y-4">
          <h2 className="font-semibold">Disabled</h2>
          <Textarea label="Ghi chú" placeholder="Không thể nhập" disabled />
        </section>

        {/* Full width */}
        <section className="space-y-4">
          <h2 className="font-semibold">Full width</h2>
          <Textarea
            label="Địa chỉ"
            placeholder="Nhập địa chỉ chi tiết"
            fullWidth
          />
        </section>
      </div>
      {/* ===============LoadingScreen UI Demo============ */}
      <div className=" bg-gray-50 p-6 space-y-6">
        <h1 className="text-2xl font-bold">LoadingScreen UI Demo</h1>

        <div className="flex gap-3">
          <Button onClick={() => setLoading(true)}>Show Loading</Button>
          <Button variant="outline" onClick={() => setLoading(false)}>
            Hide Loading
          </Button>
        </div>

        <p className="text-char-700">
          Nhấn <b>Show Loading</b> để hiển thị loading toàn màn hình.
        </p>

        {loading && (
          <LoadingScreen message="Đang tải dữ liệu, vui lòng chờ..." />
        )}
      </div>
    </div>
  );
};

export default TestUI;
