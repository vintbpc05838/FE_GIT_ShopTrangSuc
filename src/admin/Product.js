import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/admin/product.css";
import { notification, Spin } from "antd"; 
import ProductCreate from "./ProductCreate";
import ProductEdit from "./ProductEdit";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    // Add missing state variables for filtering
    const [selectedType, setSelectedType] = useState("Tất cả");
    const [selectedMaterial, setSelectedMaterial] = useState("Tất cả");
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProducts(), fetchMaterials(), fetchSizes(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/admin/product-details/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("error", "Lỗi", "Không thể tải danh sách sản phẩm.");
    }
  };

  const fetchMaterials = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/admin/product-details/materials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      showNotification("error", "Lỗi", "Không thể tải danh sách chất liệu.");
    }
  };

  const fetchSizes = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/admin/product-details/sizes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSizes(response.data);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      showNotification("error", "Lỗi", "Không thể tải danh sách kích thước.");
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/admin/product-details/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showNotification("error", "Lỗi", "Không thể tải danh sách danh mục.");
    }
  };

  const handleAdd = () => setShowCreateForm(true);

  const handleEdit = (productId) => {
    const product = products.find(p => p.detailProductId === productId);
    setProductToEdit(product);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/admin/products/${selectedProductIds.join(",")}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(product => !selectedProductIds.includes(product.detailProductId)));
      resetSelection();
      showNotification("success", "Thành công", "Xóa sản phẩm thành công.");
    } catch (error) {
      console.error("Error deleting products:", error);
      showNotification("error", "Lỗi", "Không thể xóa sản phẩm.");
    }
  };

  const toggleCheckBox = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
    setShowCheckBox(true);
  };

  const resetSelection = () => {
    setShowCheckBox(false);
    setSelectedProductIds([]);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 2;

    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 1) {
        pageNumbers.push(1, 2, "...");
      } else if (currentPage >= totalPages) {
        pageNumbers.push("...", totalPages - 1, totalPages);
      } else {
        pageNumbers.push("...", currentPage, "...");
      }
    }
    return pageNumbers;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleUpdateProduct = async (updatedProductData) => {
    const token = localStorage.getItem("token");
    try {
      const productId = updatedProductData.get("id");
      await axios.post(`http://localhost:8080/api/admin/product-details/update/${productId}`, updatedProductData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchProducts(); // Refresh product list
      showNotification("success", "Thành công", "Cập nhật sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      showNotification("error", "Lỗi", "Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  const handleCreateProduct = async (newProduct) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/admin/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      setShowCreateForm(false);
      setCurrentPage(1);
      showNotification("success", "Thành công", "Tạo sản phẩm thành công!");
    } catch (error) {
      console.error("Error creating product:", error);
      showNotification("error", "Lỗi", "Có lỗi xảy ra khi tạo sản phẩm.");
    }
  };

  const filteredProducts = products.filter(product => {
    const typeMatch = selectedType === "Tất cả" || product.productCategory.categoryName === selectedType;
    const materialMatch = selectedMaterial === "Tất cả" || product.material.materialName === selectedMaterial;
    return typeMatch && materialMatch;
  });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const showNotification = (type, message, description = "") => {
    notification[type]({
      message: message,
      description: description,
      duration: 3,
    });
  };

  const moveToTrash = async () => {
    const token = localStorage.getItem("token");
    if (selectedProductIds.length === 0) {
      showNotification("warning", "Vui lòng chọn ít nhất một sản phẩm để xóa.");
      return;
    }
  
    try {
      await Promise.all(
        selectedProductIds.map((id) =>
          axios.put(`http://localhost:8080/api/admin/product-details/move-to-trash/${id}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      showNotification("success", "Thành công", "Các sản phẩm đã được chuyển vào thùng rác.");
      fetchProducts(); // Reload product list
      resetSelection(); // Clear selections after deletion
    } catch (error) {
      console.error("Lỗi khi chuyển sản phẩm vào thùng rác:", error);
      showNotification("error", "Lỗi", "Có lỗi xảy ra khi chuyển sản phẩm vào thùng rác.");
    }
  };
  
  const confirmDelete = () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn chuyển các sản phẩm đã chọn vào thùng rác?");
    if (confirm) {
      moveToTrash();
    }
  };

  return (
    <div className="product-container">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {!showCreateForm && !productToEdit && (
            <div className="row m-3">
              <select onChange={(e) => setSelectedType(e.target.value)} className="form-select-product1 form-select-sm">
                <option value="Tất cả">Tất cả</option>
                <option value="Nhẫn">Nhẫn</option>
                <option value="Vòng cổ">Vòng cổ</option>
                <option value="Vòng tay">Vòng tay</option>
                <option value="Hoa tai">Hoa tai</option>
              </select>
              <select onChange={(e) => setSelectedMaterial(e.target.value)} className="form-select-product2 form-select-sm">
                <option value="Tất cả">Tất cả</option>
                <option value="Bạc">Bạc</option>
                <option value="Vàng">Vàng</option>
                <option value="Titan">Titan</option>
              </select>
              <button onClick={handleAdd} className="btn btn-add-product">Thêm Sản Phẩm</button>
              {showCheckBox ? (
                <>
                  <button onClick={confirmDelete} className="btn btn-confimdelete-product">
                    Xác Nhận Xóa
                  </button>
                  <button onClick={resetSelection} className="btn btn-cancel-product">
                    <i className="bi bi-x-lg"></i> Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowCheckBox(true)}
                  className="btn btn-delete-product"
                >
                  Chọn Xóa
                </button>
              )}
            </div>
          )}

          {showCreateForm && <ProductCreate onCreate={handleCreateProduct} />}

          {productToEdit && (
            <ProductEdit 
              product={productToEdit} 
              onUpdate={handleUpdateProduct} 
              onCancel={() => setProductToEdit(null)} 
              materials={materials}
              sizes={sizes}
              categories={categories}
            />
          )}

          {!showCreateForm && !productToEdit && (
            <div className="product">
              <div className="card">
                <h2 className="font-product">Danh sách sản phẩm</h2>
                <hr className="hr-product" />
                <div className="card-body">
                  <table className="table-product">
                    <thead className="thead-product">
                      <tr className="tr-product">
                        <th className="th-product">#</th>
                        <th className="th-product">ID</th>
                        <th className="th-product">Hình ảnh</th>
                        <th className="th-product">Tên sản phẩm</th>
                        <th className="th-product">Giá</th>
                        <th className="th-product">Chất liệu</th>
                        <th className="th-product">Loại</th>
                        <th className="th-product">Trạng thái</th>
                        <th className="th-product">Số lượng</th>
                        <th className="th-product">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map((product) => (
                        <tr key={product.detailProductId} className="tr-product">
                          <td className="td-product">
                            {showCheckBox && (
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`flexCheckDefault-${product.detailProductId}`}
                                  checked={selectedProductIds.includes(product.detailProductId)}
                                  onChange={() => toggleCheckBox(product.detailProductId)}
                                />
                              </div>
                            )}
                          </td>
                          <td className="td-product">{product.detailProductId}</td>
                          <td className="td-product">
                            {product.images.length > 0 ? (
                              <img src={product.images[0].imageUrl} alt={product.productName} className="images" />
                            ) : (
                              <span>Không có hình ảnh</span>
                            )}
                          </td>
                          <td className="td-product">{product.productName}</td>
                          <td className="td-product">{product.price.toLocaleString()} VND</td>
                          <td className="td-product">{product.material.materialName}</td>
                          <td className="td-product">{product.productCategory.categoryName}</td>
                          <td className="td-product">{product.status}</td>
                          <td className="td-product">{product.quantity}</td>
                          <td className="td-product">
                            <button onClick={() => handleEdit(product.detailProductId)} className="btn btn-edit-product">
                              Sửa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="nav-product-custom">
                  <nav>
                    <ul className="pagination-product">
                      <li className={`page-item-product ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link-product" onClick={handlePreviousPage} disabled={currentPage === 1}>
                          <span aria-hidden="true">&laquo;</span>
                        </button>
                      </li>
                      {generatePageNumbers().map((pageNumber, index) => (
                        <li key={index} className={`page-item-product ${currentPage === pageNumber ? "active" : ""}`}>
                          <button className="page-link-product" onClick={() => paginate(pageNumber)}>
                            {pageNumber}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item-product ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link-product" onClick={handleNextPage} disabled={currentPage === totalPages}>
                          <span aria-hidden="true">&raquo;</span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Product;