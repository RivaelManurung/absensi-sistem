package office

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

	res, err := h.svc.GetAll(page, limit, search)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to fetch offices", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Success", res)
}

func (h *Handler) GetByID(c *gin.Context) {
	id := c.Param("officeId")
	res, err := h.svc.GetByID(id)
	if err != nil {
		response.Error(c, http.StatusNotFound, "Office not found", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Success", res)
}

func (h *Handler) Create(c *gin.Context) {
	var req OfficeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	res, err := h.svc.Create(req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to create office", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "Office created successfully", res)
}

func (h *Handler) Update(c *gin.Context) {
	id := c.Param("officeId")
	var req OfficeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	res, err := h.svc.Update(id, req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to update office", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Office updated successfully", res)
}

func (h *Handler) Delete(c *gin.Context) {
	id := c.Param("officeId")
	if err := h.svc.Delete(id); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to delete office", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Office deleted successfully", nil)
}

func (h *Handler) GetMyOffice(c *gin.Context) {
	officeID, exists := c.Get("office_id")
	if !exists || officeID == "" {
		response.Error(c, http.StatusBadRequest, "Office ID not found in session", "")
		return
	}

	res, err := h.svc.GetByID(officeID.(string))
	if err != nil {
		response.Error(c, http.StatusNotFound, "Office not found", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Success", res)
}
