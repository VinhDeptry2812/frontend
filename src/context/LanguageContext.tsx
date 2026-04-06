import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

const translations: Translations = {
  // Common
  'admin': { vi: 'Quản trị', en: 'Admin' },
  'login': { vi: 'Đăng nhập', en: 'Login' },
  'logout': { vi: 'Đăng xuất', en: 'Logout' },
  'loading': { vi: 'Đang xử lý...', en: 'Loading...' },
  'menu': { vi: 'Danh mục', en: 'Menu' },
  'search': { vi: 'Tìm kiếm...', en: 'Search...' },
  'actions': { vi: 'Thao tác', en: 'Actions' },
  'back': { vi: 'Quay về', en: 'Back' },
  'next': { vi: 'Trang tiếp', en: 'Next' },
  'min_price': { vi: 'Giá tối thiểu', en: 'Min Price' },
  'max_price': { vi: 'Giá tối đa', en: 'Max Price' },
  'descending': { vi: 'Giảm dần', en: 'Descending' },
  'ascending': { vi: 'Tăng dần', en: 'Ascending' },
  'filter_results': { vi: 'Lọc kết quả', en: 'Filter' },
  'all_categories': { vi: 'Tất cả danh mục', en: 'All Categories' },
  'no_category': { vi: 'Chưa phân loại', en: 'Uncategorized' },
  'available': { vi: 'có sẵn', en: 'available' },
  'out_of_stock_label': { vi: 'Hết hàng', en: 'Out of stock' },
  'confirm_delete_msg': { vi: 'Hành động này không thể hoàn tác.', en: 'This action cannot be undone.' },
  
  // Admin Login
  'admin_login_title': { vi: 'Aurelius Admin', en: 'Aurelius Admin' },
  'email_label': { vi: 'Địa chỉ Email', en: 'Email Address' },
  'password_label': { vi: 'Mật khẩu bảo mật', en: 'Secure Password' },
  'remember_me': { vi: 'Ghi nhớ tài khoản', en: 'Remember Account' },
  'authorizing': { vi: 'Đang xác thực...', en: 'Verifying...' },
  'login_success': { vi: 'Truy cập trang quản trị thành công', en: 'Admin access granted' },
  'login_error_missing': { vi: 'Vui lòng nhập email và mật khẩu', en: 'Please enter email and password' },
  
  // Nav / Sidebar
  'nav_dashboard': { vi: 'Tổng quan', en: 'Dashboard' },
  'nav_employees': { vi: 'Nhân viên', en: 'Employees' },
  'nav_products': { vi: 'Sản phẩm', en: 'Products' },
  'nav_users': { vi: 'Người dùng', en: 'Users' },
  'nav_coupons': { vi: 'Mã giảm giá', en: 'Coupons' },
  
  // Users Page
  'users_title': { vi: 'Quản Lý Người Dùng', en: 'User Management' },
  'users_subtitle': { vi: 'Hệ thống thành viên và phân quyền', en: 'Member system and permissions' },
  'accounts': { vi: 'tài khoản', en: 'accounts' },
  'search_placeholder': { vi: 'Tìm tên hoặc email...', en: 'Search name or email...' },
  'add_user': { vi: 'Thêm user', en: 'Add User' },
  'loading_data': { vi: 'Đang tải dữ liệu...', en: 'Loading data...' },
  'no_users_found': { vi: 'Không tìm thấy người dùng nào.', en: 'No users found.' },
  'member_col': { vi: 'Thành viên', en: 'Member' },
  'role_col': { vi: 'Vai trò', en: 'Role' },
  'status_col': { vi: 'Trạng thái', en: 'Status' },
  'view': { vi: 'Xem', en: 'View' },
  'edit': { vi: 'Sửa', en: 'Edit' },
  'delete': { vi: 'Xóa', en: 'Delete' },
  'active': { vi: 'Hoạt động', en: 'Active' },
  'locked': { vi: 'Tạm khóa', en: 'Locked' },
  'superadmin_role': { vi: 'Quản trị cấp cao', en: 'Super Admin' },
  'admin_role': { vi: 'Quản trị viên', en: 'Admin' },
  'user_role': { vi: 'Thành viên', en: 'User' },
  'user_profile': { vi: 'Hồ sơ người dùng', en: 'User Profile' },
  'close': { vi: 'Đóng lại', en: 'Close' },
  'cancel': { vi: 'Hủy bỏ', en: 'Cancel' },
  'confirm_delete': { vi: 'Xác nhận xoá', en: 'Confirm Delete' },
  'delete_user_title': { vi: 'Xoá người dùng?', en: 'Delete user?' },
  'delete_user_confirm': { vi: 'Bạn đang chuẩn bị xoá tài khoản', en: 'You are about to delete account' },
  'add_new_user': { vi: 'Tạo Tài Khoản Mới', en: 'Add New User' },
  'update_user': { vi: 'Cập Nhật Tài Khoản', en: 'Update User' },
  'full_name': { vi: 'Họ và Tên', en: 'Full Name' },
  'phone_number': { vi: 'Số Điện Thoại', en: 'Phone Number' },
  'email_user': { vi: 'Email Đăng Nhập', en: 'Login Email' },
  'role_permission': { vi: 'Quyền Hạn (Role)', en: 'Role & Permissions' },
  'password': { vi: 'Mật khẩu', en: 'Password' },
  'save_changes': { vi: 'Lưu Thay Đổi', en: 'Save Changes' },
  'processing': { vi: 'Đang xử lý...', en: 'Processing...' },

  // Dashboard
  'total_revenue': { vi: 'Tổng Doanh Thu', en: 'Total Revenue' },
  'products_sold': { vi: 'Sản Phẩm Đã Bán', en: 'Products Sold' },
  'new_customers': { vi: 'Khách Hàng Mới', en: 'New Customers' },
  'growth_rate': { vi: 'Tỉ lệ tăng trưởng', en: 'Growth Rate' },
  'recent_orders': { vi: 'Đơn Hàng Gần Đây', en: 'Recent Orders' },
  'latest_system_update': { vi: 'Cập nhật mới nhất từ hệ thống', en: 'Latest system updates' },
  'view_all': { vi: 'Xem tất cả', en: 'View All' },
  'order_id': { vi: 'Mã ĐH', en: 'Order ID' },
  'customer_col': { vi: 'Khách hàng', en: 'Customer' },
  'product_col': { vi: 'Sản phẩm', en: 'Product' },
  'date_col': { vi: 'Ngày', en: 'Date' },
  'total_col': { vi: 'Tổng', en: 'Total' },
  'system_status': { vi: 'Trạng Thái Hệ Thống', en: 'System Status' },
  'alerts_notifications': { vi: 'Cảnh báo và thông báo mới', en: 'Alerts and notifications' },
  'out_of_stock': { vi: 'Hết hàng', en: 'Out of Stock' },
  'out_of_stock_desc': { vi: 'Chỉ chờ nhập thêm hàng.', en: 'Waiting for restock.' },
  'new_staff_request': { vi: 'Yêu cầu nhân viên mới', en: 'New Staff Request' },
  'new_staff_request_desc': { vi: 'đã yêu cầu quyền truy cập.', en: 'requested access.' },
  'completed_status': { vi: 'Hoàn thành', en: 'Completed' },
  'shipping_status': { vi: 'Đang giao', en: 'Shipping' },

  // Employees Page
  'employee_list': { vi: 'Danh sách Nhân viên', en: 'Employee List' },
  'manage_staff': { vi: 'Quản lý tài khoản và phân quyền hệ thống', en: 'Manage staff accounts and permissions' },
  'add_staff': { vi: 'Thêm NV', en: 'Add Staff' },
  'loading_staff': { vi: 'Đang tải dữ liệu nhân viên...', en: 'Loading employee data...' },
  'no_staff_found': { vi: 'Không tìm thấy nhân viên nào.', en: 'No employees found.' },
  'staff_role': { vi: 'Nhân viên', en: 'Staff' },
  'manager_role': { vi: 'Quản lý', en: 'Manager' },
  'create_staff': { vi: 'Thêm Nhân Viên Mới', en: 'Add New Staff' },
  'update_staff': { vi: 'Cập Nhật Nhân Viên', en: 'Update Employee' },
  'staff_profile': { vi: 'Hồ Sơ Nhân Viên', en: 'Staff Profile' },
  'confirm_password': { vi: 'Xác nhận MK', en: 'Confirm Password' },
  'delete_staff_title': { vi: 'Xóa nhân viên?', en: 'Delete Employee?' },
  'superadmin_exists_warning': { vi: 'Hệ thống đã có Super Admin, không thể tạo thêm.', en: 'Super Admin already exists.' },
  'cannot_delete_self': { vi: 'Bạn không thể xóa tài khoản của chính mình.', en: 'You cannot delete your own account.' },

  // Products Page
  'product_management': { vi: 'Quản Lý Sản Phẩm', en: 'Product Management' },
  'add_product': { vi: 'Thêm sản phẩm', en: 'Add Product' },
  'product_name': { vi: 'Tên sản phẩm', en: 'Product Name' },
  'category': { vi: 'Danh mục', en: 'Category' },
  'price': { vi: 'Giá', en: 'Price' },
  'stock': { vi: 'Kho hàng', en: 'Stock' },
  'description': { vi: 'Mô tả', en: 'Description' },
  'image': { vi: 'Hình ảnh', en: 'Image' },
  'delete_product_title': { vi: 'Xoá sản phẩm?', en: 'Delete Product?' },
  'create_product': { vi: 'Tạo Sản Phẩm Mới', en: 'Create New Product' },
  'update_product': { vi: 'Cập Nhật Sản Phẩm', en: 'Update Product' },
  'no_products_found': { vi: 'Không tìm thấy sản phẩm nào.', en: 'No products found.' },
  'upload_image': { vi: 'Nhấp để chọn ảnh bìa', en: 'Click to upload cover image' },
  
  // Categories Page
  'nav_categories': { vi: 'Danh mục', en: 'Categories' },
  'category_management': { vi: 'Quản Lý Danh Mục', en: 'Category Management' },
  'add_category': { vi: 'Thêm danh mục', en: 'Add Category' },
  'parent_category': { vi: 'Danh mục cha', en: 'Parent Category' },
  'root_category': { vi: 'Danh mục gốc', en: 'Root Category' },
  'sort_order': { vi: 'Thứ tự', en: 'Sort Order' },
  'active_status': { vi: 'Đang hiện', en: 'Active' },
  'hidden_status': { vi: 'Đang ẩn', en: 'Hidden' },
  'delete_category_title': { vi: 'Xoá danh mục?', en: 'Delete category?' },
  'category_name': { vi: 'Tên danh mục', en: 'Category Name' },
  'subcategories': { vi: 'danh mục con', en: 'subcategories' },
  'delete_warning_prefix': { vi: 'Bạn có chắc chắn muốn xóa danh mục', en: 'Are you sure you want to delete category' },
  'delete_warning_suffix': { vi: 'Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các sản phẩm thuộc danh mục này.', en: 'This action cannot be undone and will affect products in this category.' },

  // Coupons Page
  'coupon_management': { vi: 'Quản Lý Mã Giảm Giá', en: 'Coupon Management' },
  'manage_coupons_desc': { vi: 'Tạo và quản lý các chương trình khuyến mãi, mã giảm giá hệ thống', en: 'Create and manage system-wide promotional coupons' },
  'add_coupon': { vi: 'Thêm mã', en: 'Add Coupon' },
  'coupon_code': { vi: 'Mã giảm giá', en: 'Coupon Code' },
  'discount_type': { vi: 'Loại giảm', en: 'Type' },
  'discount_value': { vi: 'Giá trị', en: 'Value' },
  'min_order': { vi: 'Đơn hàng tối thiểu', en: 'Min Order' },
  'max_discount': { vi: 'Giảm tối đa', en: 'Max Discount' },
  'usage_limit': { vi: 'Giới hạn', en: 'Limit' },
  'used_count': { vi: 'Đã dùng', en: 'Used' },
  'expiry_date': { vi: 'Hạn dùng', en: 'Expiry' },
  'start_date': { vi: 'Bắt đầu', en: 'Start Date' },
  'end_date': { vi: 'Kết thúc', en: 'End Date' },
  'create_coupon': { vi: 'Tạo Mã Giảm Giá Mới', en: 'Create New Coupon' },
  'update_coupon': { vi: 'Cập Nhật Mã Giảm Giá', en: 'Update Coupon' },
  'delete_coupon_title': { vi: 'Xoá mã giảm giá?', en: 'Delete Coupon?' },
  'no_coupons_found': { vi: 'Không tìm thấy mã giảm giá nào.', en: 'No coupons found.' },
  'percent': { vi: 'Phần trăm', en: 'Percentage' },
  'coupon_status': { vi: 'Trình trạng', en: 'Status' },

  // Admin Profile
  'admin_profile_title': { vi: 'Thông Tin Cá Nhân', en: 'My Profile' },
  'admin_profile_subtitle': { vi: 'Quản lý thông tin tài khoản quản trị của bạn', en: 'Manage your administrative account details' },
  'account_id': { vi: 'Mã nhân viên', en: 'Staff ID' },
  'last_login': { vi: 'Đăng nhập cuối', en: 'Last Login' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
