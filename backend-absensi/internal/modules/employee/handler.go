package employee

import (
	"backend-absensi/internal/pkg/response"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler {
	return &Handler{svc}
}

func (h *Handler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	dept := c.Query("department")
	officeID := c.Query("office_id")

	res, err := h.svc.GetAll(page, limit, search, dept, officeID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to fetch employees", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Success", res)
}

func (h *Handler) GetByID(c *gin.Context) {
	id := c.Param("id")
	res, err := h.svc.GetByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Employee not found", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Success", res)
}

func (h *Handler) Create(c *gin.Context) {
	var req EmployeeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	res, err := h.svc.Create(req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to create employee", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "Employee created successfully", res)
}

func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	var req EmployeeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	res, err := h.svc.Update(id, req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to update employee", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Employee updated successfully", res)
}

func (h *Handler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.svc.Delete(id); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to delete employee", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Employee deleted successfully", nil)
}
